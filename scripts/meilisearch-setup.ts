/**
 * Meilisearch Setup Script
 *
 * This script configures Meilisearch indexes with the proper settings
 * for searchable attributes, filterable attributes, and embedders.
 *
 * Usage:
 *   pnpm tsx scripts/meilisearch-setup.ts
 *
 * Required environment variables:
 *   - MEILISEARCH_HOST
 *   - MEILISEARCH_ADMIN_API_KEY
 *   - OPENAI_API_KEY (optional, for hybrid search)
 */

import "dotenv/config";
import { MeiliSearch } from "meilisearch";

const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST;
const MEILISEARCH_ADMIN_API_KEY = process.env.MEILISEARCH_ADMIN_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!MEILISEARCH_HOST) {
  console.error("Error: MEILISEARCH_HOST environment variable is not set");
  process.exit(1);
}

if (!MEILISEARCH_ADMIN_API_KEY) {
  console.error(
    "Error: MEILISEARCH_ADMIN_API_KEY environment variable is not set"
  );
  process.exit(1);
}

const client = new MeiliSearch({
  host: MEILISEARCH_HOST,
  apiKey: MEILISEARCH_ADMIN_API_KEY,
});

const INDEX_NAMES = {
  uk: "products_uk",
  en: "products_en",
} as const;

const INDEX_SETTINGS = {
  searchableAttributes: [
    "title",
    "brandName",
    "categoryNames",
    "tags",
    "description",
  ],
  filterableAttributes: [
    "brandId",
    "categoryIds",
    "colors",
    "gender",
    "price",
    "discountedPrice",
  ],
  sortableAttributes: ["price", "discountedPrice"],
  typoTolerance: {
    enabled: true,
  },
  faceting: {
    maxValuesPerFacet: 100,
  },
};

async function setup(): Promise<void> {
  console.log("Starting Meilisearch setup...\n");

  // Check connection
  try {
    const health = await client.health();
    console.log(`Meilisearch status: ${health.status}`);
  } catch (error) {
    console.error("Failed to connect to Meilisearch:", error);
    process.exit(1);
  }

  // Configure indexes
  for (const locale of ["uk", "en"] as const) {
    const indexName = INDEX_NAMES[locale];
    console.log(`\nConfiguring index: ${indexName}`);

    // Create index if it doesn't exist
    try {
      await client.createIndex(indexName, { primaryKey: "id" });
      console.log(`  Created index: ${indexName}`);
    } catch {
      console.log(`  Index ${indexName} already exists`);
    }

    const index = client.index(indexName);

    // Update settings
    const task = await index.updateSettings(INDEX_SETTINGS);
    console.log(`  Updated settings (task ${task.taskUid})`);

    // Wait for task to complete
    await client.tasks.waitForTask(task.taskUid);
    console.log(`  Settings applied successfully`);
  }

  // Configure embedders if OpenAI key is available
  if (OPENAI_API_KEY) {
    console.log("\nConfiguring embedders for hybrid search...");

    for (const locale of ["uk", "en"] as const) {
      const indexName = INDEX_NAMES[locale];
      const index = client.index(indexName);

      try {
        const task = await index.updateEmbedders({
          default: {
            source: "openAi",
            model: "text-embedding-3-small",
            documentTemplate: "{{doc.title}} {{doc.brandName}} {{doc.description}}",
            apiKey: OPENAI_API_KEY,
          },
        });
        console.log(`  Configured embedder for ${indexName} (task ${task.taskUid})`);
        await client.tasks.waitForTask(task.taskUid);
      } catch (error) {
        console.error(`  Failed to configure embedder for ${indexName}:`, error);
      }
    }
  } else {
    console.log(
      "\nSkipping embedder configuration (OPENAI_API_KEY not set)"
    );
    console.log(
      "Hybrid search will not be available until embedders are configured."
    );
  }

  console.log("\nSetup complete!");
  console.log("\nNext steps:");
  console.log("  1. Run 'pnpm tsx scripts/meilisearch-sync.ts' to import products");
  console.log("  2. Test search at /api/search?q=test&locale=uk");
}

setup().catch((error) => {
  console.error("Setup failed:", error);
  process.exit(1);
});
