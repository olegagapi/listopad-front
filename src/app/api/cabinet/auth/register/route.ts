import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient, createClient } from "@/lib/supabase-server";
import { validateFullRegistration } from "@/lib/brand-registration";

type Result<T> = { data: T; error: null } | { data: null; error: string };

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const formData = await request.formData();

    // Extract form fields
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const nameUk = formData.get("nameUk") as string;
    const nameEn = formData.get("nameEn") as string;
    const marketingDescUk = formData.get("marketingDescUk") as string;
    const marketingDescEn = formData.get("marketingDescEn") as string;
    const externalUrl = formData.get("externalUrl") as string;
    const instagramUrl = formData.get("instagramUrl") as string;
    const logoFile = formData.get("logo") as File | null;

    // Validate form data
    const validation = validateFullRegistration({
      email,
      password,
      confirmPassword: password, // Already validated on client
      fullName,
      nameUk,
      nameEn,
      marketingDescUk,
      marketingDescEn,
      externalUrl,
      instagramUrl,
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

    // 2. Upload logo if provided
    let logoUrl: string | null = null;
    if (logoFile && logoFile.size > 0) {
      const fileExt = logoFile.name.split(".").pop();
      const fileName = `brand-logos/${userId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabaseService.storage
        .from("brand-assets")
        .upload(fileName, logoFile, {
          contentType: logoFile.type,
          upsert: false,
        });

      if (!uploadError) {
        const {
          data: { publicUrl },
        } = supabaseService.storage.from("brand-assets").getPublicUrl(fileName);
        logoUrl = publicUrl;
      } else {
        console.error("Logo upload error:", uploadError);
        // Continue without logo - not critical
      }
    }

    // 3. Create brand
    const { data: brandData, error: brandError } = await supabaseService
      .from("brands")
      .insert({
        name_uk: nameUk,
        name_en: nameEn,
        marketing_desc_uk: marketingDescUk || null,
        marketing_desc_en: marketingDescEn || null,
        external_url: externalUrl || null,
        inst_url: instagramUrl || null,
        logo_url: logoUrl,
      })
      .select("id")
      .single();

    if (brandError) {
      console.error("Brand creation error:", brandError);
      // Cleanup: delete auth user on failure
      await supabaseService.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { data: null, error: "Failed to create brand" },
        { status: 500 }
      );
    }

    // 4. Create brand manager
    const { error: managerError } = await supabaseService
      .from("brand_managers")
      .insert({
        user_id: userId,
        brand_id: brandData.id,
        full_name: fullName,
        status: "pending", // Will become active after email verification
      });

    if (managerError) {
      console.error("Brand manager creation error:", managerError);
      // Cleanup
      await supabaseService.from("brands").delete().eq("id", brandData.id);
      await supabaseService.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { data: null, error: "Failed to create brand manager" },
        { status: 500 }
      );
    }

    // 5. Send verification email
    const supabase = await createClient();
    await supabase.auth.resend({
      type: "signup",
      email,
    });

    return NextResponse.json({
      data: { message: "Registration successful. Please verify your email." },
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
