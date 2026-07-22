import { describe, it, expect } from "vitest";
import { defineModifiers } from "#modules/modifiers/config";

describe("defineModifiers", () => {
  it("returns the schema unchanged (identity helper for typed authoring)", () => {
    const schema = { button: { variant: ["solid", "outline"] } };
    expect(defineModifiers(schema)).toBe(schema);
  });

  it("accepts an empty schema", () => {
    expect(defineModifiers({})).toEqual({});
  });
});
