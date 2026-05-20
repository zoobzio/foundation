import { describe, it, expect } from "vitest";
import { mockProvider } from "../src/providers";
import { defineI18nProvider } from "../src/config";
import type { SourceMap } from "../src/types";

const sourceMap: SourceMap = {
  abc123: "Save changes",
  def456: "Cancel",
};

describe("mockProvider", () => {
  it("wraps text with locale prefix", () => {
    const result = mockProvider.translate(sourceMap, "es");
    expect(result).toEqual({
      abc123: "[es] Save changes",
      def456: "[es] Cancel",
    });
  });

  it("uses the correct locale code", () => {
    const result = mockProvider.translate(sourceMap, "fr");
    expect(result).toEqual({
      abc123: "[fr] Save changes",
      def456: "[fr] Cancel",
    });
  });

  it("handles empty source map", () => {
    const result = mockProvider.translate({}, "en");
    expect(result).toEqual({});
  });
});

describe("defineI18nProvider", () => {
  it("returns the provider as-is", () => {
    const custom = defineI18nProvider({
      translate: (source, locale) => {
        const messages: Record<string, string> = {};
        for (const [hash, text] of Object.entries(source)) {
          messages[hash] = `${locale}:${text.toUpperCase()}`;
        }
        return messages;
      },
    });
    const result = custom.translate(sourceMap, "de");
    expect(result).toEqual({
      abc123: "de:SAVE CHANGES",
      def456: "de:CANCEL",
    });
  });

  it("supports async providers", async () => {
    const custom = defineI18nProvider({
      translate: async (source, locale) => {
        const messages: Record<string, string> = {};
        for (const [hash, text] of Object.entries(source)) {
          messages[hash] = `[${locale}] ${text}`;
        }
        return messages;
      },
    });
    const result = await custom.translate(sourceMap, "ja");
    expect(result).toEqual({
      abc123: "[ja] Save changes",
      def456: "[ja] Cancel",
    });
  });
});
