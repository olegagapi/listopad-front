import { createClient } from "@/lib/supabase-server";
import type { BrandManager } from "@/types/auth";

/**
 * Fetches the brand manager record for the currently authenticated user.
 * Returns null if not authenticated or no brand manager record exists.
 */
export async function getBrandManager(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<BrandManager | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("brand_managers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id as string,
    userId: data.user_id as string,
    brandId: data.brand_id as number | null,
    fullName: data.full_name as string,
    phone: data.phone as string | null,
    status: data.status as BrandManager["status"],
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  };
}
