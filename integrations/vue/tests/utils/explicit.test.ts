import { describe, expect, it } from "vitest";
import { isExplicit } from "../../src/utils/explicit";

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
