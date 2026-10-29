// A wrapped component keeps the wrapped component's contract: the attrs
// the consumer passed reach it as given, its emits are relayed, a `pt` layer
// sits under the consumer's, slot defaults fill in only where the consumer
// renders none, and `ctx` is exposed through.
import type { WrapOptions } from "../../src/types/wrap";

import { describe, expect, it } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";
import { wrap } from "../../src/utils/wrap";
import { usePassthrough } from "../../src/composables/passthrough";
import { useContext } from "../../src/composables/context";
import Hero from "../../src/components/hero.vue";
import Menu from "../../src/components/menu.vue";

type Parts = {
  root: { class?: string; title?: string };
  item: (label: string) => { class?: string; "data-label"?: string };
};

// The wrapped component: a label, an optional flag, a part manifest, one
// emit, and an `icon` slot with no default.
const Core = defineComponent({
  name: "Core",
  props: {
    label: { type: String, required: true },
    open: { type: Boolean, default: undefined },
    pt: { type: Object, default: undefined },
  },
  emits: ["select"],
  setup(props, { emit, slots, expose }) {
    const settings = usePassthrough<Parts>(() => ({
      pt: props.pt,
      recipes: {
        root: { title: "core" },
        item: (label) => ({ "data-label": label }),
      },
    }));
    const ctx = useContext("core", () => ({ label: props.label }));
    expose({ ctx });
    return () =>
      h(
        "div",
        { ...settings.value.root, onClick: () => emit("select", props.label) },
        [
          h("span", settings.value.item(props.label), props.label),
          h("i", { "data-open": String(props.open) }),
          slots.icon?.({ label: props.label }) ?? "no icon",
        ],
      );
  },
});

describe("wrap", () => {
  it("hands the attrs on and leaves an absent prop absent", async () => {
    const Wrapped = wrap(Core);
    const wrapper = mount(Wrapped, {
      props: { label: "one", class: "mine" },
    });
    expect(wrapper.get("div").classes()).toContain("mine");
    expect(wrapper.get("i").attributes("data-open")).toBe("undefined");
    await wrapper.setProps({ label: "one", open: true });
    expect(wrapper.get("i").attributes("data-open")).toBe("true");
  });

  it("declares the wrapped component's emits and relays each as its own", async () => {
    const Wrapped = wrap(Core);
    expect(Wrapped.emits).toEqual(["select"]);
    const selected: string[] = [];
    const wrapper = mount(Wrapped, {
      props: {
        label: "one",
        onSelect: (label: string) => selected.push(label),
      },
    });
    await wrapper.get("div").trigger("click");
    expect(selected).toEqual(["one"]);
    expect(wrapper.emitted("select")).toEqual([["one"]]);
  });

  it("lays a static pt layer under the consumer's, composing function parts", () => {
    const Wrapped = wrap(Core, {
      pt: { root: { class: "laid" }, item: () => ({ class: "laid-item" }) },
    });
    const wrapper = mount(Wrapped, {
      props: {
        label: "one",
        pt: { root: { title: "mine" }, item: () => ({ "data-label": "mine" }) },
      },
    });
    const root = wrapper.get("div");
    expect(root.classes()).toEqual(["laid"]);
    expect(root.attributes("title")).toBe("mine");
    const item = wrapper.get("span");
    expect(item.classes()).toEqual(["laid-item"]);
    expect(item.attributes("data-label")).toBe("mine");
  });

  it("serves the layer alone when the consumer passes no pt", () => {
    const Wrapped = wrap(Core, { pt: { root: { class: "laid" } } });
    const wrapper = mount(Wrapped, { props: { label: "one" } });
    expect(wrapper.get("div").classes()).toEqual(["laid"]);
    expect(wrapper.get("div").attributes("title")).toBe("core");
  });

  it("hands a function layer the consumer's pt and uses what it returns", () => {
    const seen: unknown[] = [];
    const Wrapped = wrap(Core, {
      pt: (pt) => {
        seen.push(pt);
        return { ...pt, root: { ...pt?.root, class: "fn" } };
      },
    });
    const wrapper = mount(Wrapped, {
      props: { label: "one", pt: { root: { title: "mine" } } },
    });
    expect(seen).toEqual([{ root: { title: "mine" } }]);
    expect(wrapper.get("div").classes()).toEqual(["fn"]);
    expect(wrapper.get("div").attributes("title")).toBe("mine");
  });

  it("fills a slot default where the consumer renders none, and lets the consumer win", () => {
    const Wrapped = wrap(Core, {
      slots: { icon: ({ label }) => [h("b", `${label}!`)] },
    });
    const bare = mount(Wrapped, { props: { label: "one" } });
    expect(bare.get("b").text()).toBe("one!");
    const own = mount(Wrapped, {
      props: { label: "one" },
      slots: { icon: ({ label }: { label: string }) => h("u", label) },
    });
    expect(own.find("b").exists()).toBe(false);
    expect(own.get("u").text()).toBe("one");
  });

  it("follows a consumer slot that appears or disappears after mount", async () => {
    const Wrapped = wrap(Core, { slots: { icon: () => [h("b", "default")] } });
    const mine = ref(false);
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Wrapped,
            { label: "one" },
            mine.value ? { icon: () => [h("u", "mine")] } : {},
          );
      },
    });
    const wrapper = mount(Host);
    expect(wrapper.get("b").text()).toBe("default");
    mine.value = true;
    await nextTick();
    expect(wrapper.find("b").exists()).toBe(false);
    expect(wrapper.get("u").text()).toBe("mine");
    mine.value = false;
    await nextTick();
    expect(wrapper.get("b").text()).toBe("default");
  });

  it("exposes the wrapped component's ctx and keeps its name", () => {
    const Wrapped = wrap(Core);
    const wrapper = mount(Wrapped, { props: { label: "one" } });
    const { ctx } = wrapper.vm as { ctx?: { id: string; label: string } };
    expect(ctx).toEqual({ id: "core", label: "one" });
    expect(Wrapped.name).toBe("Core");
  });
});

// The option types read the wrapped component's own contract, from either
// encoding: a generic SFC (the menu) and a plain one (the hero).
describe("WrapOptions", () => {
  it("types the layer and the defaults from the component", () => {
    const menu: WrapOptions<typeof Menu> = {
      pt: { link: () => ({ as: "span" }) },
      slots: { itemLabel: ({ item }) => [h("i", item.label)] },
    };
    const hero: WrapOptions<typeof Hero> = {
      pt: { link: { as: "span" } },
      slots: { title: ({ title }) => [h("b", title)] },
    };
    const bad: WrapOptions<typeof Menu> = {
      // @ts-expect-error -- not a menu slot
      slots: { nope: () => [] },
    };
    const Wrapped: typeof Menu = wrap(Menu, menu);
    expect([menu, hero, bad, Wrapped]).toHaveLength(4);
  });
});
