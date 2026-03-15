import { describe, it, expect } from "vitest";
import {
  isValidGender,
  isValidColor,
  isValidSort,
  parseArrayParam,
  parseNumberParam,
} from "./shopFilterValidation";

describe("isValidGender", () => {
  it("accepts 'male'", () => {
    expect(isValidGender("male")).toBe(true);
  });

  it("accepts 'female'", () => {
    expect(isValidGender("female")).toBe(true);
  });

  it("accepts 'unisex'", () => {
    expect(isValidGender("unisex")).toBe(true);
  });

  it("rejects empty string", () => {
    expect(isValidGender("")).toBe(false);
  });

  it("rejects invalid value", () => {
    expect(isValidGender("other")).toBe(false);
  });

  it("rejects case mismatch", () => {
    expect(isValidGender("Male")).toBe(false);
  });
});

describe("isValidColor", () => {
  it("accepts all 14 valid colors", () => {
    const colors = [
      "white", "black", "grey", "red", "green", "blue",
      "yellow", "brown", "orange", "cyan", "magenta",
      "indigo", "silver", "gold",
    ];
    for (const color of colors) {
      expect(isValidColor(color)).toBe(true);
    }
  });

  it("rejects empty string", () => {
    expect(isValidColor("")).toBe(false);
  });

  it("rejects invalid color", () => {
    expect(isValidColor("purple")).toBe(false);
  });

  it("rejects case mismatch", () => {
    expect(isValidColor("Red")).toBe(false);
  });
});

describe("isValidSort", () => {
  it("accepts 'relevance'", () => {
    expect(isValidSort("relevance")).toBe(true);
  });

  it("accepts 'price:asc'", () => {
    expect(isValidSort("price:asc")).toBe(true);
  });

  it("accepts 'price:desc'", () => {
    expect(isValidSort("price:desc")).toBe(true);
  });

  it("rejects empty string", () => {
    expect(isValidSort("")).toBe(false);
  });

  it("rejects invalid sort", () => {
    expect(isValidSort("name:asc")).toBe(false);
  });
});

describe("parseArrayParam", () => {
  it("returns empty array for null", () => {
    expect(parseArrayParam(null)).toEqual([]);
  });

  it("returns empty array for empty string", () => {
    expect(parseArrayParam("")).toEqual([]);
  });

  it("parses comma-separated values", () => {
    expect(parseArrayParam("a,b,c")).toEqual(["a", "b", "c"]);
  });

  it("filters out empty segments from trailing commas", () => {
    expect(parseArrayParam("a,b,")).toEqual(["a", "b"]);
  });

  it("handles single value", () => {
    expect(parseArrayParam("solo")).toEqual(["solo"]);
  });
});

describe("parseNumberParam", () => {
  it("returns null for null", () => {
    expect(parseNumberParam(null)).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parseNumberParam("")).toBeNull();
  });

  it("returns null for non-numeric string", () => {
    expect(parseNumberParam("abc")).toBeNull();
  });

  it("parses integer", () => {
    expect(parseNumberParam("42")).toBe(42);
  });

  it("parses decimal", () => {
    expect(parseNumberParam("19.99")).toBe(19.99);
  });

  it("parses zero", () => {
    expect(parseNumberParam("0")).toBe(0);
  });

  it("parses negative number", () => {
    expect(parseNumberParam("-5")).toBe(-5);
  });
});
