import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient, createClient } from "@/lib/supabase-server";
import { validateAccountStep } from "@/lib/brand-registration";

/**
 * Phase 1 of registration: Create user account and brand_manager record (without brand).
 * After this, user is redirected to /brand-register/complete to add brand info.
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();

    const { email, password, fullName } = body;

    // Validate account data
    const validation = validateAccountStep({
      email,
      password,
      confirmPassword: password,
      fullName,
    });

    if (validation.success === false) {
      const errorMessage = validation.errors.issues
        .map((issue: { message: string }) => issue.message)
        .join(", ");
      return NextResponse.json(
        { data: null, error: errorMessage },
        { status: 400 }
      );
    }

    // Use service role client for privileged operations
    const supabaseService = await createServiceClient();

    // 1. Create auth user
    const { data: authData, error: authError } =
      await supabaseService.auth.admin.createUser({
        email,
        password,
        email_confirm: false, // User must verify email
      });

    if (authError) {
      console.error("Auth error:", authError);
      if (authError.message.includes("already registered")) {
        return NextResponse.json(
          { data: null, error: "Email already registered" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { data: null, error: "Failed to create account" },
        { status: 500 }
      );
    }

    const userId = authData.user.id;

    // 2. Create brand manager (without brand - will be added in complete step)
    const { error: managerError } = await supabaseService
      .from("brand_managers")
      .insert({
        user_id: userId,
        brand_id: null, // Will be set in complete-registration
        full_name: fullName,
        status: "pending", // Will become active after brand is created
      });

    if (managerError) {
      console.error("Brand manager creation error:", managerError);
      // Cleanup: delete auth user on failure
      await supabaseService.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { data: null, error: "Failed to create account" },
        { status: 500 }
      );
    }

    // 3. Send verification email
    const supabase = await createClient();
    await supabase.auth.resend({
      type: "signup",
      email,
    });

    // 4. Sign in the user so they can complete registration
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return NextResponse.json({
      data: {
        message: "Account created. Please complete your brand registration.",
        redirectTo: "/brand-register/complete",
      },
      error: null,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
