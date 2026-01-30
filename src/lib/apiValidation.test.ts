import { describe, it, expect } from "vitest";
import {
  parseCommaSeparated,
  parseNumber,
  parseBoolean,
  validateLocale,
  validateSort,
  validateGenders,
  validateColors,
} from "./apiValidation";

describe("parseCommaSeparated", () => {
  it("returns empty array for null", () => {
    expect(parseCommaSeparated(null)).toEqual([]);
  });

  it("returns empty array for empty string", () => {
    expect(parseCommaSeparated("")).toEqual([]);
  });

  it("parses single value", () => {
    expect(parseCommaSeparated("1")).toEqual(["1"]);
  });

  it("parses multiple values", () => {
    expect(parseCommaSeparated("1,2,3")).toEqual(["1", "2", "3"]);
  });

  it("trims whitespace", () => {
    expect(parseCommaSeparated(" 1 , 2 , 3 ")).toEqual(["1", "2", "3"]);
  });

  it("filters out empty strings", () => {
    expect(parseCommaSeparated("1,,2,")).toEqual(["1", "2"]);
  });

  it("handles mixed whitespace and empty values", () => {
    expect(parseCommaSeparated(" , 1 , , 2 , ")).toEqual(["1", "2"]);
  });
});

describe("parseNumber", () => {
  it("returns undefined for null", () => {
    expect(parseNumber(null)).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(parseNumber("")).toBeUndefined();
  });

  it("parses integer", () => {
    expect(parseNumber("42")).toBe(42);
  });

  it("parses float", () => {
    expect(parseNumber("3.14")).toBe(3.14);
  });

  it("parses negative number", () => {
    expect(parseNumber("-10")).toBe(-10);
  });

  it("parses zero", () => {
    expect(parseNumber("0")).toBe(0);
  });

  it("returns undefined for non-numeric string", () => {
    expect(parseNumber("abc")).toBeUndefined();
  });

  it("returns undefined for mixed string", () => {
    expect(parseNumber("12abc")).toBeUndefined();
  });
});

describe("parseBoolean", () => {
  it("returns false for null", () => {
    expect(parseBoolean(null)).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(parseBoolean("")).toBe(false);
  });

  it("returns true for 'true'", () => {
    expect(parseBoolean("true")).toBe(true);
  });

  it("returns true for '1'", () => {
    expect(parseBoolean("1")).toBe(true);
  });

  it("returns false for 'false'", () => {
    expect(parseBoolean("false")).toBe(false);
  });

  it("returns false for '0'", () => {
    expect(parseBoolean("0")).toBe(false);
  });

  it("returns false for other strings", () => {
    expect(parseBoolean("yes")).toBe(false);
    expect(parseBoolean("TRUE")).toBe(false);
  });
});

describe("validateLocale", () => {
  it("returns uk for null", () => {
    expect(validateLocale(null)).toBe("uk");
  });

  it("returns uk for empty string", () => {
    expect(validateLocale("")).toBe("uk");
  });

  it("returns uk for valid uk", () => {
    expect(validateLocale("uk")).toBe("uk");
  });

  it("returns en for valid en", () => {
    expect(validateLocale("en")).toBe("en");
  });

  it("returns uk for invalid locale", () => {
    expect(validateLocale("fr")).toBe("uk");
  });

  it("returns uk for uppercase UK", () => {
    expect(validateLocale("UK")).toBe("uk");
  });
});

describe("validateSort", () => {
  it("returns relevance for null", () => {
    expect(validateSort(null)).toBe("relevance");
  });

  it("returns relevance for empty string", () => {
    expect(validateSort("")).toBe("relevance");
  });

  it("returns relevance for valid relevance", () => {
    expect(validateSort("relevance")).toBe("relevance");
  });

  it("returns price:asc for valid price:asc", () => {
    expect(validateSort("price:asc")).toBe("price:asc");
  });

  it("returns price:desc for valid price:desc", () => {
    expect(validateSort("price:desc")).toBe("price:desc");
  });

  it("returns discountedPrice:asc for valid option", () => {
    expect(validateSort("discountedPrice:asc")).toBe("discountedPrice:asc");
  });

  it("returns discountedPrice:desc for valid option", () => {
    expect(validateSort("discountedPrice:desc")).toBe("discountedPrice:desc");
  });

  it("returns relevance for invalid sort", () => {
    expect(validateSort("name:asc")).toBe("relevance");
  });
});

describe("validateGenders", () => {
  it("returns empty array for empty input", () => {
    expect(validateGenders([])).toEqual([]);
  });

  it("filters valid genders", () => {
    expect(validateGenders(["male", "female"])).toEqual(["male", "female"]);
  });

  it("returns all valid genders", () => {
    expect(validateGenders(["male", "female", "unisex"])).toEqual([
      "male",
      "female",
      "unisex",
    ]);
  });

  it("filters out invalid genders", () => {
    expect(validateGenders(["male", "invalid", "female"])).toEqual([
      "male",
      "female",
    ]);
  });

  it("returns empty array for all invalid", () => {
    expect(validateGenders(["invalid", "unknown"])).toEqual([]);
  });

  it("is case sensitive", () => {
    expect(validateGenders(["Male", "FEMALE"])).toEqual([]);
  });
});

describe("validateColors", () => {
  it("returns empty array for empty input", () => {
    expect(validateColors([])).toEqual([]);
  });

  it("filters valid colors", () => {
    expect(validateColors(["white", "black", "red"])).toEqual([
      "white",
      "black",
      "red",
    ]);
  });

  it("returns all 14 valid colors when provided", () => {
    const allColors = [
      "white", "black", "grey", "red", "green", "blue",
      "yellow", "brown", "orange", "cyan", "magenta",
      "indigo", "silver", "gold",
    ];
    expect(validateColors(allColors)).toEqual(allColors);
  });

  it("filters out invalid colors", () => {
    expect(validateColors(["white", "purple", "black"])).toEqual([
      "white",
      "black",
    ]);
  });

  it("returns empty array for all invalid", () => {
    expect(validateColors(["purple", "pink", "teal"])).toEqual([]);
  });

  it("is case sensitive", () => {
    expect(validateColors(["White", "BLACK"])).toEqual([]);
  });
});
