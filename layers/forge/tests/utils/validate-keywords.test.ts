import { describe, it, expect } from "vitest";
import { validateKeywords } from "../../app/utils/validate-keywords";

describe("validateKeywords", () => {
  describe("valid inputs", () => {
    it("accepts single include term", () => {
      expect(validateKeywords("+foo")).toBe(true);
    });

    it("accepts single exclude term", () => {
      expect(validateKeywords("-foo")).toBe(true);
    });

    it("accepts multiple terms separated by spaces", () => {
      expect(validateKeywords("+foo -bar")).toBe(true);
    });

    it("accepts quoted phrases", () => {
      expect(validateKeywords('+"hello world"')).toBe(true);
    });

    it("accepts exclude quoted phrases", () => {
      expect(validateKeywords('-"hello world"')).toBe(true);
    });

    it("accepts OR segments", () => {
      expect(validateKeywords("+foo || +bar")).toBe(true);
    });

    it("accepts mixed include/exclude with OR", () => {
      expect(validateKeywords("+foo -baz || +bar")).toBe(true);
    });
  });

  describe("invalid inputs", () => {
    it("rejects empty string", () => {
      expect(validateKeywords("")).toBe(false);
    });

    it("rejects whitespace only", () => {
      expect(validateKeywords("   ")).toBe(false);
    });

    it("rejects bare terms without +/-", () => {
      expect(validateKeywords("foo")).toBe(false);
    });

    it("rejects single pipe", () => {
      expect(validateKeywords("+foo | +bar")).toBe(false);
    });

    it("rejects empty OR segment", () => {
      expect(validateKeywords("+foo || ")).toBe(false);
    });
  });
});
