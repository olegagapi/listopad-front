import { describe, it, expect } from "vitest";

/**
 * Tests for analytics event validation logic.
 * These test the validation rules used in the POST /api/analytics endpoint
 * without requiring Next.js API route infrastructure.
 */

const VALID_EVENT_TYPES = [
  "brand_page_view",
  "product_view",
  "external_click",
  "wishlist_add",
] as const;

type EventType = (typeof VALID_EVENT_TYPES)[number];

function isValidEventType(value: unknown): value is EventType {
  return (
    typeof value === "string" &&
    VALID_EVENT_TYPES.includes(value as EventType)
  );
}

type ValidationResult =
  | { valid: true; data: { eventType: EventType; brandId: number; productId: number | null } }
  | { valid: false; error: string };

function validateAnalyticsPayload(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return { valid: false, error: "Invalid request body" };
  }

  const { eventType, brandId, productId } = body as Record<string, unknown>;

  if (!isValidEventType(eventType)) {
    return { valid: false, error: "Invalid event type" };
  }

  if (typeof brandId !== "number" || !Number.isInteger(brandId)) {
    return { valid: false, error: "Invalid brand ID" };
  }

  if (
    productId !== undefined &&
    productId !== null &&
    (typeof productId !== "number" || !Number.isInteger(productId))
  ) {
    return { valid: false, error: "Invalid product ID" };
  }

  return {
    valid: true,
    data: {
      eventType,
      brandId,
      productId: (productId as number | null | undefined) ?? null,
    },
  };
}

describe("isValidEventType", () => {
  it("accepts brand_page_view", () => {
    expect(isValidEventType("brand_page_view")).toBe(true);
  });

  it("accepts product_view", () => {
    expect(isValidEventType("product_view")).toBe(true);
  });

  it("accepts external_click", () => {
    expect(isValidEventType("external_click")).toBe(true);
  });

  it("accepts wishlist_add", () => {
    expect(isValidEventType("wishlist_add")).toBe(true);
  });

  it("rejects empty string", () => {
    expect(isValidEventType("")).toBe(false);
  });

  it("rejects unknown event type", () => {
    expect(isValidEventType("page_view")).toBe(false);
  });

  it("rejects null", () => {
    expect(isValidEventType(null)).toBe(false);
  });

  it("rejects number", () => {
    expect(isValidEventType(42)).toBe(false);
  });

  it("rejects undefined", () => {
    expect(isValidEventType(undefined)).toBe(false);
  });
});

describe("validateAnalyticsPayload", () => {
  describe("valid payloads", () => {
    it("accepts valid event with brandId only", () => {
      const result = validateAnalyticsPayload({
        eventType: "brand_page_view",
        brandId: 1,
      });
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.data.eventType).toBe("brand_page_view");
        expect(result.data.brandId).toBe(1);
        expect(result.data.productId).toBeNull();
      }
    });

    it("accepts valid event with brandId and productId", () => {
      const result = validateAnalyticsPayload({
        eventType: "product_view",
        brandId: 5,
        productId: 42,
      });
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.data.eventType).toBe("product_view");
        expect(result.data.brandId).toBe(5);
        expect(result.data.productId).toBe(42);
      }
    });

    it("accepts null productId", () => {
      const result = validateAnalyticsPayload({
        eventType: "external_click",
        brandId: 3,
        productId: null,
      });
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.data.productId).toBeNull();
      }
    });

    it("accepts all valid event types", () => {
      for (const eventType of VALID_EVENT_TYPES) {
        const result = validateAnalyticsPayload({ eventType, brandId: 1 });
        expect(result.valid).toBe(true);
      }
    });
  });

  describe("invalid body", () => {
    it("rejects null body", () => {
      const result = validateAnalyticsPayload(null);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toBe("Invalid request body");
      }
    });

    it("rejects string body", () => {
      const result = validateAnalyticsPayload("not an object");
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toBe("Invalid request body");
      }
    });

    it("rejects number body", () => {
      const result = validateAnalyticsPayload(123);
      expect(result.valid).toBe(false);
    });
  });

  describe("invalid eventType", () => {
    it("rejects missing eventType", () => {
      const result = validateAnalyticsPayload({ brandId: 1 });
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toBe("Invalid event type");
      }
    });

    it("rejects unknown eventType", () => {
      const result = validateAnalyticsPayload({
        eventType: "unknown_event",
        brandId: 1,
      });
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toBe("Invalid event type");
      }
    });

    it("rejects numeric eventType", () => {
      const result = validateAnalyticsPayload({ eventType: 42, brandId: 1 });
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toBe("Invalid event type");
      }
    });
  });

  describe("invalid brandId", () => {
    it("rejects missing brandId", () => {
      const result = validateAnalyticsPayload({
        eventType: "brand_page_view",
      });
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toBe("Invalid brand ID");
      }
    });

    it("rejects string brandId", () => {
      const result = validateAnalyticsPayload({
        eventType: "brand_page_view",
        brandId: "abc",
      });
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toBe("Invalid brand ID");
      }
    });

    it("rejects float brandId", () => {
      const result = validateAnalyticsPayload({
        eventType: "brand_page_view",
        brandId: 1.5,
      });
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toBe("Invalid brand ID");
      }
    });

    it("rejects null brandId", () => {
      const result = validateAnalyticsPayload({
        eventType: "brand_page_view",
        brandId: null,
      });
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toBe("Invalid brand ID");
      }
    });
  });

  describe("invalid productId", () => {
    it("rejects string productId", () => {
      const result = validateAnalyticsPayload({
        eventType: "product_view",
        brandId: 1,
        productId: "abc",
      });
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toBe("Invalid product ID");
      }
    });

    it("rejects float productId", () => {
      const result = validateAnalyticsPayload({
        eventType: "product_view",
        brandId: 1,
        productId: 1.5,
      });
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toBe("Invalid product ID");
      }
    });

    it("rejects boolean productId", () => {
      const result = validateAnalyticsPayload({
        eventType: "product_view",
        brandId: 1,
        productId: true,
      });
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toBe("Invalid product ID");
      }
    });
  });
});
