import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const isRegistration = searchParams.get("registration") === "true";

  // Default redirect based on flow type
  const defaultRedirect = isRegistration ? "/brand-register/complete" : "/cabinet";

  if (!code) {
    // No code provided, redirect to login with error
    return NextResponse.redirect(new URL("/brand-login?error=no_code", origin));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL("/brand-login?error=config", origin));
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignore errors in Server Components
        }
      },
    },
  });

  // Exchange the code for a session
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("OAuth code exchange error:", exchangeError);
    return NextResponse.redirect(new URL("/brand-login?error=exchange_failed", origin));
  }

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/brand-login?error=no_user", origin));
  }

  // Check if user already has a brand manager record
  const { data: existingManager } = await supabase
    .from("brand_managers")
    .select("id, status, brand_id")
    .eq("user_id", user.id)
    .single();

  if (isRegistration) {
    // Registration flow
    if (existingManager) {
      // User already has a brand manager record
      if (existingManager.brand_id) {
        // Already has a brand, go to cabinet
        return NextResponse.redirect(new URL("/cabinet", origin));
      }
      // Has manager record but no brand - continue to complete registration
      return NextResponse.redirect(new URL("/brand-register/complete", origin));
    }
    // No manager record - continue to complete registration
    return NextResponse.redirect(new URL(defaultRedirect, origin));
  } else {
    // Login flow
    if (!existingManager) {
      // Not a brand manager yet - redirect to complete registration
      return NextResponse.redirect(new URL("/brand-register/complete", origin));
    }

    // Check if brand registration is incomplete
    if (!existingManager.brand_id) {
      // Has manager record but no brand - redirect to complete registration
      return NextResponse.redirect(new URL("/brand-register/complete", origin));
    }

    if (existingManager.status === "suspended") {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/brand-login?error=suspended", origin));
    }

    if (existingManager.status === "pending") {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/brand-login?error=pending", origin));
    }

    // All good - redirect to cabinet
    return NextResponse.redirect(new URL("/cabinet", origin));
  }
}
