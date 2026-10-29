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

  it("renders a per-datum forward with the datum as its props", async () => {
    const Iter = defineComponent({
      setup(_, { slots }) {
        const { Item } = useForward({
          Item: {
            component: Child,
            props: ({ name }: { name: string }) => ({ label: name }),
            slots,
          },
        });
        return { Item };
      },
      render() {
        return h(
          "div",
          ["a", "b"].map((name) => h(this.Item, { name })),
        );
      },
    });
    const wrapper = mount(Iter, {
      slots: { body: ({ label }: { label: string }) => `<${label}>` },
    });
    expect(wrapper.text()).toBe("a: <a>b: <b>");
  });

  it("renders a part forward through the component under its `as`", async () => {
    const Other = defineComponent({
      props: { label: { type: String, required: true } },
      setup(props, { slots }) {
        return () =>
          h("i", [props.label, "/", slots.body?.({ label: props.label })]);
      },
    });
    const Part = defineComponent({
      props: { swap: { type: Boolean, default: false } },
      setup(props, { slots }) {
        const Item = useForward({
          props: ({ name }: { name: string }) => ({
            as: props.swap ? Other : Child,
            label: name,
          }),
          slots,
        });
        return { Item };
      },
      render() {
        return h("div", [h(this.Item, { name: "a" })]);
      },
    });
    const wrapper = mount(Part, {
      slots: { body: ({ label }: { label: string }) => `<${label}>` },
    });
    expect(wrapper.get("p").text()).toBe("a: <a>");
    await wrapper.setProps({ swap: true });
    expect(wrapper.find("p").exists()).toBe(false);
    expect(wrapper.get("i").text()).toBe("a/<a>");
  });

  it("renders a single entry without a record", async () => {
    const Single = defineComponent({
      setup(_, { slots }) {
        const label = ref("solo");
        const One = useForward({
          component: Child,
          props: () => ({ label: label.value }),
          slots,
        });
        const Each = useForward({
          component: Child,
          props: ({ name }: { name: string }) => ({ label: name }),
          slots,
        });
        return { label, One, Each };
      },
      render() {
        return h("div", [h(this.One), h(this.Each, { name: "a" })]);
      },
    });
    const wrapper = mount(Single, {
      slots: { body: ({ label }: { label: string }) => `<${label}>` },
    });
    expect(wrapper.text()).toBe("solo: <solo>a: <a>");
    wrapper.vm.label = "changed";
    await nextTick();
    expect(wrapper.text()).toBe("changed: <changed>a: <a>");
  });

  it("checks the props against the component", () => {
    useForward({
      // @ts-expect-error `label` must be a string
      wrong: { component: Child, props: () => ({ label: 1 }), slots: {} },
    });
    useForward({
      wrongIter: {
        // @ts-expect-error `label` must be a string
        component: Child,
        props: ({ n }: { n: number }) => ({ label: n }),
        slots: {},
      },
    });
    const wrong = () => ({ label: 1 });
    // @ts-expect-error `label` must be a string
    useForward({ component: Child, props: wrong, slots: {} });
  });
});
