import { describe, it, expect } from "vitest";
import components from "#config/components";

describe("components.elements", () => {
  it("is a non-empty list", () => {
    expect(components.elements.length).toBeGreaterThan(0);
  });

  it("contains no duplicate entries", () => {
    expect(new Set(components.elements).size).toBe(components.elements.length);
  });

  it("includes representative element keys", () => {
    expect(components.elements).toContain("button");
    expect(components.elements).toContain("h1");
    expect(components.elements).toContain("tr");
  });

  it("uses lowercase, non-empty keys", () => {
    for (const component of components.elements) {
      expect(component).toBe(component.toLowerCase());
      expect(component.length).toBeGreaterThan(0);
    }
  });
});
