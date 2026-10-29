// The primitive: `as` names the component, the rest of the
// part is its props, listeners included, and the parent's slots reach it
// whole, named ones too, which is what reka's Primitive does not do.
import { describe, expect, it } from "vitest";
import { defineComponent, h, markRaw } from "vue";
import { mount } from "@vue/test-utils";
import Primitive from "../../src/components/primitive.vue";

const Child = markRaw(
  defineComponent({
    props: { label: { type: String, required: true } },
    emits: ["pick"],
    setup(props, { emit, slots }) {
      return () =>
        h("button", { onClick: () => emit("pick", props.label) }, [
          slots.prepend?.(),
          props.label,
          slots.default?.(),
        ]);
    },
  }),
);

const Other = markRaw(
  defineComponent({
    props: { label: { type: String, required: true } },
    setup(props) {
      return () => h("i", `other:${props.label}`);
    },
  }),
);

describe("primitive", () => {
  it("renders `as` with the rest of the part as its props", async () => {
    const picked: string[] = [];
    const wrapper = mount(Primitive, {
      props: {
        as: Child,
        label: "one",
        onPick: (label: string) => picked.push(label),
      },
    });
    expect(wrapper.get("button").text()).toBe("one");
    await wrapper.get("button").trigger("click");
    expect(picked).toEqual(["one"]);
  });

  it("hands named slots on, not only the default", () => {
    const wrapper = mount(Primitive, {
      props: { as: Child, label: "one" },
      slots: { prepend: () => h("b", "<"), default: () => h("u", ">") },
    });
    expect(wrapper.get("button").element.innerHTML).toBe(
      "<b>&lt;</b>one<u>&gt;</u>",
    );
  });

  it("renders another component in place when `as` is swapped", () => {
    const wrapper = mount(Primitive, { props: { as: Other, label: "one" } });
    expect(wrapper.get("i").text()).toBe("other:one");
    expect(wrapper.find("button").exists()).toBe(false);
  });
});
