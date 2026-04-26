import { describe, it, expect } from "vitest";
import { isRef } from "vue";
import { usePassthrough, useItemPassthrough } from "../../app/composables/passthrough";

describe("usePassthrough", () => {
  it("returns a computed ref", () => {
    const result = usePassthrough(undefined, { props: { value: "a" }, handlers: {} });
    expect(isRef(result)).toBe(true);
  });

  it("computes merged passthrough from localPT when userPT is undefined", () => {
    const result = usePassthrough(undefined, { props: { value: "a" }, handlers: {} });
    expect(result.value.props).toEqual({ value: "a" });
    expect(result.value.handlers).toEqual({});
  });

  it("computes merged passthrough with userPT overrides", () => {
    const result = usePassthrough(
      { props: { value: "b", class: "custom" } },
      { props: { value: "a" }, handlers: {} },
    );
    expect(result.value.props).toEqual({ value: "b", class: "custom" });
  });
});

describe("useItemPassthrough", () => {
  it("returns a computed ref", () => {
    const items = [{ id: 1 }, { id: 2 }];
    const result = useItemPassthrough(items, undefined, (item) => ({
      props: { value: item.id },
      handlers: {},
    }));
    expect(isRef(result)).toBe(true);
  });

  it("maps items with merged passthrough", () => {
    const items = [{ id: "a" }, { id: "b" }];
    const result = useItemPassthrough(items, undefined, (item) => ({
      props: { value: item.id },
      handlers: {},
    }));
    expect(result.value).toHaveLength(2);
    expect(result.value[0].item).toEqual({ id: "a" });
    expect(result.value[0].pt.props).toEqual({ value: "a" });
    expect(result.value[1].item).toEqual({ id: "b" });
    expect(result.value[1].pt.props).toEqual({ value: "b" });
  });

  it("applies userPT overrides to each item", () => {
    const items = [{ id: "a" }];
    const result = useItemPassthrough(
      items,
      { props: { class: "custom" } },
      (item) => ({ props: { value: item.id }, handlers: {} }),
    );
    expect(result.value[0].pt.props).toEqual({ value: "a", class: "custom" });
  });
});
