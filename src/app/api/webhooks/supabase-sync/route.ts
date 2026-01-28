import { NextRequest } from "next/server";
import { indexProduct, deleteProduct } from "@/lib/meilisearch-sync";
import type { SupabaseWebhookPayload } from "@/types/search";

// Webhook secret for verification
const WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET;

/**
 * Verify the webhook request is authentic
 */
function verifyWebhook(request: NextRequest): boolean {
  if (!WEBHOOK_SECRET) {
    console.warn("SUPABASE_WEBHOOK_SECRET not set, skipping verification");
    return true;
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return false;
  }

  const token = authHeader.replace("Bearer ", "");
  return token === WEBHOOK_SECRET;
}

/**
 * Handle product sync webhook from Supabase
 *
 * POST /api/webhooks/supabase-sync
 *
 * Expected payload:
 * {
 *   "type": "INSERT" | "UPDATE" | "DELETE",
 *   "table": "products",
 *   "schema": "public",
 *   "record": { ... } | null,
 *   "old_record": { ... } | null
 * }
 */
export async function POST(request: NextRequest): Promise<Response> {
  // Verify authentication
  if (!verifyWebhook(request)) {
    return Response.json(
      { data: null, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const payload = (await request.json()) as SupabaseWebhookPayload;

    // Only handle products table
    if (payload.table !== "products") {
      return Response.json({
        data: { message: "Ignored: not products table" },
        error: null,
      });
    }

    switch (payload.type) {
      case "INSERT":
      case "UPDATE": {
        const record = payload.record;
        if (!record || typeof record.id !== "number") {
          return Response.json(
            { data: null, error: "Invalid record: missing id" },
            { status: 400 }
          );
        }

        await indexProduct(record.id);

        return Response.json({
          data: {
            message: `Product ${record.id} indexed successfully`,
            type: payload.type,
          },
          error: null,
        });
      }

      case "DELETE": {
        const oldRecord = payload.old_record;
        if (!oldRecord || typeof oldRecord.id !== "number") {
          return Response.json(
            { data: null, error: "Invalid old_record: missing id" },
            { status: 400 }
          );
        }

        await deleteProduct(oldRecord.id);

        return Response.json({
          data: {
            message: `Product ${oldRecord.id} deleted from index`,
            type: payload.type,
          },
          error: null,
        });
      }

      default:
        return Response.json({
          data: { message: `Ignored: unknown type ${payload.type}` },
          error: null,
        });
    }
  } catch (error) {
    console.error("Webhook error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return Response.json({ data: null, error: errorMessage }, { status: 500 });
  }
}
