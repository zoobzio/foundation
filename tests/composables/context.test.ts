import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { useContext } from "#foundation/composables/context";

describe("useContext", () => {
  it("wraps the source as a computed view model", () => {
    const ctx = useContext("span", () => ({ label: "hello" }));
    expect(ctx.value.label).toBe("hello");
  });

  it("inherits the name as id", () => {
    const ctx = useContext("select-trigger", () => ({}));
    expect(ctx.value.id).toBe("select-trigger");
  });

  it("tracks the source reactively", () => {
    const open = ref(false);
    const ctx = useContext("select", () => ({ open: open.value }));
    expect(ctx.value.open).toBe(false);
    open.value = true;
    expect(ctx.value.open).toBe(true);
  });
});
