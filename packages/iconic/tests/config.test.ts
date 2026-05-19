import { describe, it, expect } from "vitest";
import { defineIconic, mergeIconic } from "../src/config";
import type { IconifyJSON } from "../src/config";

const testIconSet: IconifyJSON = {
  prefix: "test",
  icons: {
    home: {
      body: '<path d="M10 20v-6h4v6" fill="currentColor"/>',
      width: 24,
      height: 24,
    },
    star: {
      body: '<path d="M12 2l3 7h7l-5 5 2 7-7-4"/>',
    },
    empty: {
      body: "",
    },
  },
};

describe("defineIconic", () => {
  it("returns entries with correct viewBox for valid aliases", () => {
    const { entries } = defineIconic(testIconSet, { home: "home" });
    expect(entries.home).toEqual({ viewBox: "0 0 24 24" });
  });

  it("uses default 24x24 dimensions when not specified", () => {
    const { entries } = defineIconic(testIconSet, { star: "star" });
    expect(entries.star.viewBox).toBe("0 0 24 24");
  });

  it("uses icon-specified dimensions", () => {
    const customSet: IconifyJSON = {
      prefix: "custom",
      icons: {
        wide: { body: "<rect/>", width: 48, height: 32 },
      },
    };
    const { entries } = defineIconic(customSet, { wide: "wide" });
    expect(entries.wide.viewBox).toBe("0 0 48 32");
  });

  it("generates symbols with correct id and viewBox", () => {
    const { symbols } = defineIconic(testIconSet, { home: "home" });
    expect(symbols).toContain('<symbol id="home" viewBox="0 0 24 24">');
    expect(symbols).toContain("currentColor");
  });

  it("maps multiple aliases", () => {
    const { entries, symbols } = defineIconic(testIconSet, {
      nav: "home",
      favorite: "star",
    });
    expect(entries.nav).toBeDefined();
    expect(entries.favorite).toBeDefined();
    expect(symbols).toContain('id="nav"');
    expect(symbols).toContain('id="favorite"');
  });

  it("skips aliases that reference missing icons", () => {
    const { entries, symbols } = defineIconic(testIconSet, {
      home: "home",
      missing: "nonexistent" as keyof typeof testIconSet.icons & string,
    });
    expect(entries.home).toBeDefined();
    expect(entries.missing).toBeUndefined();
    expect(symbols).not.toContain('id="missing"');
  });

  it("returns empty entries and symbols for empty aliases", () => {
    const { entries, symbols } = defineIconic(testIconSet, {});
    expect(entries).toEqual({});
    expect(symbols).toBe("");
  });

  it("includes SVG body content in symbol", () => {
    const { symbols } = defineIconic(testIconSet, { home: "home" });
    expect(symbols).toContain('<path d="M10 20v-6h4v6" fill="currentColor"/>');
  });
});

describe("mergeIconic", () => {
  it("merges entries from multiple results", () => {
    const a = defineIconic(testIconSet, { home: "home" });
    const b = defineIconic(testIconSet, { star: "star" });
    const { entries } = mergeIconic(a, b);
    expect(entries.home).toBeDefined();
    expect(entries.star).toBeDefined();
  });

  it("produces a sprite wrapping all symbols", () => {
    const a = defineIconic(testIconSet, { home: "home" });
    const b = defineIconic(testIconSet, { star: "star" });
    const { sprite } = mergeIconic(a, b);
    expect(sprite).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(sprite).toContain('id="home"');
    expect(sprite).toContain('id="star"');
  });

  it("handles a single result", () => {
    const a = defineIconic(testIconSet, { home: "home" });
    const { entries, sprite } = mergeIconic(a);
    expect(entries.home).toBeDefined();
    expect(sprite).toContain('id="home"');
  });

  it("later results override earlier entries with same key", () => {
    const customSet: IconifyJSON = {
      prefix: "other",
      icons: { alt: { body: "<circle/>", width: 32, height: 32 } },
    };
    const a = defineIconic(testIconSet, { icon: "home" });
    const b = defineIconic(customSet, { icon: "alt" });
    const { entries } = mergeIconic(a, b);
    expect(entries.icon.viewBox).toBe("0 0 32 32");
  });
});
