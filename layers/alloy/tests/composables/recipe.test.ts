import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { useAccordion, useDialog } from "../../app/composables/recipe";

describe("useRecipe", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useDialog(
      { title: "Test", description: "Desc" },
      {},
    );
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
    expect(result.value.props.title).toBe("Test");
  });

  it("is reactive — updates when getter input changes", () => {
    const title = ref("First");
    const result = useDialog(
      () => ({ title: title.value, description: "Desc" }),
      {},
    );
    expect(result.value.props.title).toBe("First");
    title.value = "Second";
    expect(result.value.props.title).toBe("Second");
  });

  it("accepts ref inputs", () => {
    const props = ref({ items: [{ value: "a", label: "A" }] });
    const result = useAccordion(props, {});
    expect(result.value.props.items).toHaveLength(1);
  });

  it("includes handlers in the result", () => {
    const handler = () => {};
    const result = useDialog(
      { title: "T", description: "D" },
      { "update:open": handler },
    );
    expect(result.value.handlers["update:open"]).toBe(handler);
  });
});
