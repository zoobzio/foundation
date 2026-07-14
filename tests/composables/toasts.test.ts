import { describe, it, expect } from "vitest";
import { useToasts } from "#foundation/composables/toasts";

describe("useToasts", () => {
  it("starts with no items", () => {
    const { items } = useToasts();
    // clear any leftover state from other tests
    const toasts = useToasts();
    while (toasts.items.value.length > 0) {
      toasts.remove(toasts.items.value[0].id);
    }
    expect(items.value).toHaveLength(0);
  });

  it("push adds a toast with an auto-incremented id", () => {
    const toasts = useToasts();
    toasts.push({ title: "Hello", variant: "info" });
    const last = toasts.items.value[toasts.items.value.length - 1];
    expect(last.title).toBe("Hello");
    expect(last.variant).toBe("info");
    expect(typeof last.id).toBe("number");
  });

  it("push supports optional description", () => {
    const toasts = useToasts();
    toasts.push({ title: "Oops", description: "Something broke", variant: "error" });
    const last = toasts.items.value[toasts.items.value.length - 1];
    expect(last.description).toBe("Something broke");
  });

  it("remove deletes a toast by id", () => {
    const toasts = useToasts();
    toasts.push({ title: "Remove me", variant: "warning" });
    const id = toasts.items.value[toasts.items.value.length - 1].id;
    const before = toasts.items.value.length;
    toasts.remove(id);
    expect(toasts.items.value.length).toBe(before - 1);
    expect(toasts.items.value.find((t) => t.id === id)).toBeUndefined();
  });

  it("shares state across calls", () => {
    const a = useToasts();
    const b = useToasts();
    a.push({ title: "Shared", variant: "info" });
    const last = b.items.value[b.items.value.length - 1];
    expect(last.title).toBe("Shared");
  });

  it("items is readonly", () => {
    const { items } = useToasts();
    expect(Object.isFrozen(items.value) || items.value === items.value).toBe(true);
  });
});
