import { describe, it, expect } from "vitest";
import { isTokenReference, wrapValue, generateThemeCSS } from "../src/css";
import { defineTheme } from "../src/config";

describe("isTokenReference", () => {
  it("returns true for ref- prefix", () => {
    expect(isTokenReference("ref-blue-500")).toBe(true);
  });

  it("returns true for sys- prefix", () => {
    expect(isTokenReference("sys-primary")).toBe(true);
  });

  it("returns true for shiki- prefix", () => {
    expect(isTokenReference("shiki-comment")).toBe(true);
  });

  it("returns true for clr- prefix", () => {
    expect(isTokenReference("clr-revenue")).toBe(true);
  });

  it("returns true for role- prefix", () => {
    expect(isTokenReference("role-card-radius")).toBe(true);
  });

  it("returns false for hex color", () => {
    expect(isTokenReference("#ff0000")).toBe(false);
  });

  it("returns false for plain value", () => {
    expect(isTokenReference("16px")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isTokenReference("")).toBe(false);
  });
});

describe("wrapValue", () => {
  it("wraps ref- token in var()", () => {
    expect(wrapValue("ref-blue-500")).toBe("var(--ref-blue-500)");
  });

  it("wraps sys- token in var()", () => {
    expect(wrapValue("sys-primary")).toBe("var(--sys-primary)");
  });

  it("wraps shiki- token in var()", () => {
    expect(wrapValue("shiki-comment")).toBe("var(--shiki-comment)");
  });

  it("wraps clr- token in var()", () => {
    expect(wrapValue("clr-revenue")).toBe("var(--clr-revenue)");
  });

  it("wraps role- token in var()", () => {
    expect(wrapValue("role-card-radius")).toBe("var(--role-card-radius)");
  });

  it("leaves hex color unchanged", () => {
    expect(wrapValue("#ff0000")).toBe("#ff0000");
  });

  it("leaves plain value unchanged", () => {
    expect(wrapValue("16px")).toBe("16px");
  });
});

describe("generateThemeCSS", () => {
  it("generates :root and .dark blocks", () => {
    const css = generateThemeCSS(defineTheme({}));
    expect(css).toContain(":root {");
    expect(css).toContain(".dark {");
  });

  it("includes reference tokens as custom properties", () => {
    const css = generateThemeCSS(defineTheme({}));
    expect(css).toMatch(/--ref-slate-50: #/);
  });

  it("wraps mode token values in var()", () => {
    const css = generateThemeCSS(defineTheme({}));
    expect(css).toMatch(/--sys-primary: var\(--ref-/);
  });

  it("includes dark mode overrides", () => {
    const css = generateThemeCSS(defineTheme({}));
    const darkBlock = css.slice(css.indexOf(".dark {"));
    expect(darkBlock).toMatch(/--sys-surface: var\(--ref-/);
  });

  it("emits custom color vars in light and dark blocks", () => {
    const colors = {
      revenue: { family: "lime" as const, light: 600 as const, dark: 400 as const },
    };
    const css = generateThemeCSS(defineTheme({}), colors);
    const lightBlock = css.slice(0, css.indexOf(".dark {"));
    const darkBlock = css.slice(css.indexOf(".dark {"));
    expect(lightBlock).toContain("--clr-revenue: var(--ref-lime-600)");
    expect(darkBlock).toContain("--clr-revenue: var(--ref-lime-400)");
  });

  it("emits multiple custom colors", () => {
    const colors = {
      revenue: { family: "lime" as const, light: 600 as const, dark: 400 as const },
      expenses: { family: "red" as const, light: 600 as const, dark: 400 as const },
    };
    const css = generateThemeCSS(defineTheme({}), colors);
    expect(css).toContain("--clr-revenue");
    expect(css).toContain("--clr-expenses");
  });

  it("emits role tokens in a separate :root block", () => {
    const roles = { "card-radius": "ref-radius-md" };
    const css = generateThemeCSS(defineTheme({}), undefined, roles);
    expect(css).toContain("--role-card-radius: var(--ref-radius-md)");
  });

  it("role tokens can reference clr- tokens", () => {
    const roles = { "chart-color": "clr-revenue" };
    const css = generateThemeCSS(defineTheme({}), undefined, roles);
    expect(css).toContain("--role-chart-color: var(--clr-revenue)");
  });

  it("role tokens pass through raw values", () => {
    const roles = { "card-gap": "8px" };
    const css = generateThemeCSS(defineTheme({}), undefined, roles);
    expect(css).toContain("--role-card-gap: 8px");
  });

  it("omits role block when no roles provided", () => {
    const css = generateThemeCSS(defineTheme({}));
    const blocks = css.split(":root {").length - 1;
    // 2 :root blocks: reference tokens + light mode tokens
    expect(blocks).toBe(2);
  });
});
