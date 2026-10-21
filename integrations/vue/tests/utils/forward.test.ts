import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";
import { forward } from "../../src/utils/forward";

// A child with one declared slot and a default. Props: a label.
const Child = defineComponent({
  props: { label: { type: String, required: true } },
  setup(props, { slots }) {
    return () =>
      h("p", [
        props.label,
        ": ",
        slots.body ? slots.body({ label: props.label }) : "default",
      ]);
  },
});

describe("forward", () => {
  it("renders the component with its props and the slot record", () => {
    const Host = defineComponent({
      render: () =>
        forward({
          component: Child,
          props: () => ({ label: "one" }),
          slots: { body: ({ label }: { label: string }) => `<${label}>` },
        }),
    });
    expect(mount(Host).text()).toBe("one: <one>");
  });

  it("keeps the child's slot defaults when the record is empty", () => {
    const Host = defineComponent({
      render: () =>
        forward({
          component: Child,
          props: () => ({ label: "one" }),
          slots: {},
        }),
    });
    expect(mount(Host).text()).toBe("one: default");
  });
});
