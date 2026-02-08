import { NextResponse, type NextRequest } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { data: null, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if user already has a brand
    const { data: existingManager } = await supabase
      .from("brand_managers")
      .select("id, brand_id")
      .eq("user_id", user.id)
      .single();

    if (existingManager?.brand_id) {
      return NextResponse.json(
        { data: null, error: "Already registered" },
        { status: 400 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const fullName = formData.get("fullName") as string;
    const nameUk = formData.get("nameUk") as string;
    const nameEn = formData.get("nameEn") as string;
    const marketingDescUk = formData.get("marketingDescUk") as string;
    const marketingDescEn = formData.get("marketingDescEn") as string;
    const externalUrl = formData.get("externalUrl") as string;
    const instagramUrl = formData.get("instagramUrl") as string;
    const logoFile = formData.get("logo") as File | null;

    // Validate required fields
    if (!fullName || !nameUk || !nameEn) {
      return NextResponse.json(
        { data: null, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Use service role client for privileged operations
    const supabaseService = await createServiceClient();

    // Upload logo if provided
    let logoUrl: string | null = null;
    if (logoFile && logoFile.size > 0) {
      const fileExt = logoFile.name.split(".").pop();
      const fileName = `brand-logos/${user.id}-${Date.now()}.${fileExt}`;

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
        // Continue without logo
      }
    }

    // Create brand
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
      return NextResponse.json(
        { data: null, error: "Failed to create brand" },
        { status: 500 }
      );
    }

    // Determine status based on email confirmation
    // OAuth users have confirmed emails, email+password users need to verify
    const isEmailConfirmed = user.email_confirmed_at != null;
    const newStatus = isEmailConfirmed ? "active" : "pending";

    if (existingManager) {
      // Update existing brand manager with brand ID
      const { error: updateError } = await supabaseService
        .from("brand_managers")
        .update({
          brand_id: brandData.id,
          full_name: fullName,
          status: newStatus,
        })
        .eq("id", existingManager.id);

      if (updateError) {
        console.error("Brand manager update error:", updateError);
        // Cleanup
        await supabaseService.from("brands").delete().eq("id", brandData.id);
        return NextResponse.json(
          { data: null, error: "Failed to complete registration" },
          { status: 500 }
        );
      }
    } else {
      // Create new brand manager (OAuth flow - no existing manager record)
      const { error: managerError } = await supabaseService
        .from("brand_managers")
        .insert({
          user_id: user.id,
          brand_id: brandData.id,
          full_name: fullName,
          status: newStatus,
        });

      if (managerError) {
        console.error("Brand manager creation error:", managerError);
        // Cleanup
        await supabaseService.from("brands").delete().eq("id", brandData.id);
        return NextResponse.json(
          { data: null, error: "Failed to create brand manager" },
          { status: 500 }
        );
      }
    }

    // Return different message based on email confirmation status
    const message = isEmailConfirmed
      ? "Registration completed successfully"
      : "Registration completed. Please verify your email to activate your account.";

    return NextResponse.json({
      data: {
        message,
        isEmailConfirmed,
      },
      error: null,
    });
  } catch (error) {
    console.error("Complete registration error:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
