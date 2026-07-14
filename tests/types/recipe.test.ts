import { describe, it, expect } from "vitest";
import { recipe } from "#foundation/utils/recipe";

describe("recipe", () => {
  it("creates a recipe with props and handlers", () => {
    const handler = (_v: string) => {};
    const r = recipe<{ value: string }, { select: [v: string] }>({ value: "a" }, { select: handler });
    expect(r.props).toEqual({ value: "a" });
    expect(r.handlers.select).toBe(handler);
  });

  it("defaults handlers to empty object", () => {
    const r = recipe<{ value: string }>({ value: "a" });
    expect(r.props).toEqual({ value: "a" });
    expect(r.handlers).toEqual({});
  });

  it("accepts HtmlAttrs in props", () => {
    const r = recipe<{ value: string }>({ value: "a", class: "custom", "data-test": "yes" });
    expect(r.props).toEqual({ value: "a", class: "custom", "data-test": "yes" });
  });
});
