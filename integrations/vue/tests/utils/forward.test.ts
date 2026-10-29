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

  it("maps a datum to the props of a per-datum forward", () => {
    const Host = defineComponent({
      render: () =>
        forward(
          {
            component: Child,
            props: ({ name }: { name: string }) => ({ label: name }),
            slots: {},
          },
          { name: "two" },
        ),
    });
    expect(mount(Host).text()).toBe("two: default");
  });

  it("renders a part forward through the getter's `as` with the rest as props", () => {
    const Host = defineComponent({
      render: () =>
        forward(
          {
            props: ({ name }: { name: string }) => ({ as: Child, label: name }),
            slots: { body: ({ label }: { label: string }) => `<${label}>` },
          },
          { name: "part" },
        ),
    });
    const wrapper = mount(Host);
    expect(wrapper.text()).toBe("part: <part>");
    expect(wrapper.get("p").attributes("as")).toBeUndefined();
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
