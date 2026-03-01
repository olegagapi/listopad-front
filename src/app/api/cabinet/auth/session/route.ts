import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import type { SessionResponse, BrandManager } from "@/types/auth";

type Result<T> = { data: T; error: null } | { data: null; error: string };

export async function GET(): Promise<Response> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      const response: Result<SessionResponse> = {
        data: { user: null, brandManager: null },
        error: null,
      };
      return NextResponse.json(response);
    }

    // Fetch brand manager data
    const { data: managerData, error: managerError } = await supabase
      .from("brand_managers")
      .select("*, brands(logo_url)")
      .eq("user_id", user.id)
      .single();

    let brandManager: BrandManager | null = null;

    if (!managerError && managerData) {
      const brands = managerData.brands as { logo_url: string | null } | null;
      brandManager = {
        id: managerData.id as string,
        userId: managerData.user_id as string,
        brandId: managerData.brand_id as number | null,
        fullName: managerData.full_name as string,
        phone: managerData.phone as string | null,
        status: managerData.status as BrandManager["status"],
        createdAt: managerData.created_at as string,
        updatedAt: managerData.updated_at as string,
        brandLogoUrl: brands?.logo_url ?? null,
      };
    }

    const response: Result<SessionResponse> = {
      data: {
        user: {
          id: user.id,
          email: user.email ?? "",
        },
        brandManager,
      },
      error: null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
