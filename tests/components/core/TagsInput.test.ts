import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountTagsInput } from "#test/support/fixtures/components";

// Core tests stub the tier below: the behavioral element wrappers are replaced
// by name, so assertions target the stubs' bound props/attrs, not wrapper DOM.
describe("TagsInput", () => {
  describe("static", () => {
    const wrapper = mountTagsInput({ modelValue: ["vue", "react"] });

    it("renders the root part", () => {
      expect(wrapper.findComponent({ name: "TagsInputRoot" }).exists()).toBe(true);
    });

    it("renders an item per tag through the iter recipe", () => {
      const items = wrapper.findAllComponents({ name: "TagsInputItem" });
      expect(items).toHaveLength(2);
      expect(items.map((i) => i.attributes("value"))).toEqual(["vue", "react"]);
    });

    it("renders the tag text in the itemText part", () => {
      const texts = wrapper.findAllComponents({ name: "TagsInputItemText" });
      expect(texts.map((t) => t.text())).toEqual(["vue", "react"]);
    });

    it("renders the delete part with the close icon per tag", () => {
      const deletes = wrapper.findAllComponents({ name: "TagsInputItemDelete" });
      expect(deletes).toHaveLength(2);
      expect(deletes[0]?.find("i").attributes("alias")).toBe("close");
    });

    it("renders the input part with the default placeholder", () => {
      const input = wrapper.findComponent({ name: "TagsInputInput" });
      expect(input.attributes("placeholder")).toBe("Add tags...");
    });
  });

  describe("models", () => {
    it("binds controlled modelValue down", () => {
      const wrapper = mountTagsInput({ modelValue: ["vue", "react"] });
      const root = wrapper.findComponent({ name: "TagsInputRoot" });
      expect(root.attributes("modelvalue")).toBe("vue,react");
    });

    it("re-emits child updates coerced to strings (uncontrolled)", async () => {
      const wrapper = mountTagsInput();
      wrapper
        .findComponent({ name: "TagsInputRoot" })
        .vm.$emit("update:modelValue", ["x", 42]);
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([[["x", "42"]]]);
      const root = wrapper.findComponent({ name: "TagsInputRoot" });
      expect(root.attributes("modelvalue")).toBe("x,42");
    });

    it("stays pinned to the modelValue prop while controlled", async () => {
      const wrapper = mountTagsInput({ modelValue: ["vue"] });
      wrapper
        .findComponent({ name: "TagsInputRoot" })
        .vm.$emit("update:modelValue", ["react"]);
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([[["react"]]]);
      const root = wrapper.findComponent({ name: "TagsInputRoot" });
      expect(root.attributes("modelvalue")).toBe("vue");
    });
  });

  describe("ctx", () => {
    it("exposes a writable model ref", async () => {
      const wrapper = mountTagsInput();
      wrapper.vm.ctx.modelValue.value = ["cherry"];
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([[["cherry"]]]);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto the root part", () => {
      const wrapper = mountTagsInput({ pt: { root: { class: "custom" } } });
      const root = wrapper.findComponent({ name: "TagsInputRoot" });
      expect(root.classes()).toContain("custom");
    });

    it("a user iter callback replaces the local item recipe", () => {
      const wrapper = mountTagsInput({
        modelValue: ["vue", "react"],
        pt: { item: (tag) => ({ value: tag, disabled: true }) },
      });
      const items = wrapper.findAllComponents({ name: "TagsInputItem" });
      expect(items.every((i) => i.attributes("disabled") === "true")).toBe(true);
    });
  });

  describe("slots", () => {
    it("item slot overrides the default item part", () => {
      const wrapper = mountTagsInput(
        { modelValue: ["vue"] },
        { item: "<div class=\"custom-item\">Custom</div>" },
      );
      expect(wrapper.find(".custom-item").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "TagsInputItem" }).exists()).toBe(false);
    });

    it("input slot overrides the default input part", () => {
      const wrapper = mountTagsInput({}, { input: "<input class=\"custom-input\" />" });
      expect(wrapper.find(".custom-input").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "TagsInputInput" }).exists()).toBe(false);
    });
  });
});
