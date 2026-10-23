import { describe, expect, it } from "vitest";
import { isExplicit, explicit } from "../../src/utils/explicit";

describe("isExplicit", () => {
  it("finds a key by its camel or kebab name", () => {
    expect(isExplicit("modelValue", { modelValue: 1 })).toBe(true);
    expect(isExplicit("modelValue", { "model-value": 1 })).toBe(true);
    expect(isExplicit("modelValue", { other: 1 })).toBe(false);
  });

  it("counts an explicit undefined and tolerates no vnode props", () => {
    expect(isExplicit("open", { open: undefined })).toBe(true);
    expect(isExplicit("open", null)).toBe(false);
  });
});

describe("explicit", () => {
  const props = { items: [1], open: false, modelValue: undefined };

  it("projects only the keys the consumer isExplicit", () => {
    const out = explicit(props, { items: [1] });
    expect(out).toEqual({ items: [1] });
    expect("open" in out).toBe(false);
  });

  it("takes the value from the resolved props, by camel or kebab key", () => {
    expect(explicit(props, { "model-value": 2, open: true })).toEqual({
      open: false,
      modelValue: undefined,
    });
  });

  it("projects nothing without vnode props", () => {
    expect(explicit(props, null)).toEqual({});
  });
});
