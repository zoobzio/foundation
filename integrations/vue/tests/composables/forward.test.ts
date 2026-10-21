import { describe, expect, it } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";
import { useForward } from "../../src/composables/forward";

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

// A parent that forwards its whole slot record to two children.
const Parent = defineComponent({
  setup(_, { slots }) {
    const label = ref("one");
    const { first, second } = useForward({
      first: { component: Child, props: () => ({ label: label.value }), slots },
      second: { component: Child, props: () => ({ label: "two" }), slots },
    });
    return { label, first, second };
  },
  render() {
    return h("div", [h(this.first), h(this.second)]);
  },
});

describe("useForward", () => {
  it("renders each child with the parent's slots and keeps defaults", async () => {
    const wrapper = mount(Parent, {
      slots: { body: ({ label }: { label: string }) => `<${label}>` },
    });
    expect(wrapper.text()).toBe("one: <one>two: <two>");

    const bare = mount(Parent);
    expect(bare.text()).toBe("one: defaulttwo: default");
  });

  it("re-renders when a props getter changes", async () => {
    const wrapper = mount(Parent);
    wrapper.vm.label = "changed";
    await nextTick();
    expect(wrapper.text()).toBe("changed: defaulttwo: default");
  });

  it("checks the props against the component", () => {
    useForward({
      // @ts-expect-error `label` must be a string
      wrong: { component: Child, props: () => ({ label: 1 }), slots: {} },
    });
  });
});
