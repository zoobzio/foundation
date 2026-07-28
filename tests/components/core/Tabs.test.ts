import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountTabs } from "#test/support/fixtures/components";
import { fakeOptionsWithIcons } from "#test/support/data/options";

// Core tests stub the tier below: the behavioral element wrappers are replaced
// by name, so assertions target the stubs' bound props/attrs, not wrapper DOM.
describe("Tabs", () => {
  describe("static", () => {
    const wrapper = mountTabs();

    it("renders the root part", () => {
      expect(wrapper.findComponent({ name: "TabsRoot" }).exists()).toBe(true);
    });

    it("renders the list part", () => {
      expect(wrapper.findComponent({ name: "TabsList" }).exists()).toBe(true);
    });

    it("renders a trigger per option through the iter recipe", () => {
      const triggers = wrapper.findAllComponents({ name: "TabsTrigger" });
      expect(triggers).toHaveLength(3);
      expect(triggers.map((t) => t.attributes("value"))).toEqual([
        "apple",
        "banana",
        "cherry",
      ]);
    });

    it("renders content per option through the iter recipe", () => {
      const contents = wrapper.findAllComponents({ name: "TabsContent" });
      expect(contents).toHaveLength(3);
      expect(contents.map((c) => c.attributes("value"))).toEqual([
        "apple",
        "banana",
        "cherry",
      ]);
    });
  });

  describe("conditional", () => {
    it("renders an Icon when a tab has an icon", () => {
      const wrapper = mountTabs({ tabs: fakeOptionsWithIcons });
      expect(
        wrapper.findAll("i").some((i) => i.attributes("alias") === "home"),
      ).toBe(true);
    });
  });

  describe("models", () => {
    it("binds controlled modelValue down", () => {
      const wrapper = mountTabs({ modelValue: "banana" });
      const root = wrapper.findComponent({ name: "TabsRoot" });
      expect(root.attributes("modelvalue")).toBe("banana");
    });

    it("re-emits child selection coerced to string (uncontrolled)", async () => {
      const wrapper = mountTabs();
      wrapper
        .findComponent({ name: "TabsRoot" })
        .vm.$emit("update:modelValue", 42);
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([["42"]]);
      const root = wrapper.findComponent({ name: "TabsRoot" });
      expect(root.attributes("modelvalue")).toBe("42");
    });

    it("stays pinned to the modelValue prop while controlled", async () => {
      const wrapper = mountTabs({ modelValue: "apple" });
      wrapper
        .findComponent({ name: "TabsRoot" })
        .vm.$emit("update:modelValue", "banana");
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([["banana"]]);
      const root = wrapper.findComponent({ name: "TabsRoot" });
      expect(root.attributes("modelvalue")).toBe("apple");
    });
  });

  describe("ctx", () => {
    it("exposes a writable model ref", async () => {
      const wrapper = mountTabs();
      wrapper.vm.ctx.modelValue.value = "cherry";
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([["cherry"]]);
      const root = wrapper.findComponent({ name: "TabsRoot" });
      expect(root.attributes("modelvalue")).toBe("cherry");
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto the root part", () => {
      const wrapper = mountTabs({ pt: { root: { class: "custom" } } });
      const root = wrapper.findComponent({ name: "TabsRoot" });
      expect(root.classes()).toContain("custom");
    });

    it("a user iter callback replaces the local trigger recipe", () => {
      const wrapper = mountTabs({
        pt: { trigger: (option) => ({ value: option.value, disabled: true }) },
      });
      const triggers = wrapper.findAllComponents({ name: "TabsTrigger" });
      expect(triggers.every((t) => t.attributes("disabled") === "true")).toBe(
        true,
      );
    });
  });

  describe("slots", () => {
    it("trigger slot overrides default", () => {
      const wrapper = mountTabs({}, { trigger: "<em class=\"custom\">Custom</em>" });
      expect(wrapper.find("em.custom").text()).toBe("Custom");
    });

    it("content slot fills each panel", () => {
      const wrapper = mountTabs({}, { content: "<p class=\"panel\">Body</p>" });
      expect(wrapper.find("p.panel").text()).toBe("Body");
    });
  });
});
