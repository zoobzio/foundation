import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountAccordion } from "#test/support/fixtures/components";
import { fakeOptionsWithIcons } from "#test/support/data/options";

// Core tests stub the tier below: the behavioral element wrappers are replaced
// by their reka names, so assertions target the stubs' bound props/attrs. The
// item stub exposes scoped slot props ({ open: false }) so the item body renders.
describe("Accordion", () => {
  describe("static", () => {
    const wrapper = mountAccordion();

    it("renders the root part", () => {
      expect(wrapper.findComponent({ name: "AccordionRoot" }).exists()).toBe(true);
    });

    it("renders an item part per option", () => {
      expect(wrapper.findAllComponents({ name: "AccordionItem" })).toHaveLength(3);
    });

    it("renders header, trigger and content per option", () => {
      expect(wrapper.findAllComponents({ name: "AccordionHeader" })).toHaveLength(3);
      expect(wrapper.findAllComponents({ name: "AccordionTrigger" })).toHaveLength(3);
      expect(wrapper.findAllComponents({ name: "AccordionContent" })).toHaveLength(3);
    });

    it("renders item labels in the trigger area", () => {
      const triggers = wrapper.findAllComponents({ name: "AccordionTrigger" });
      expect(triggers[0].text()).toContain("Apple");
      expect(triggers[1].text()).toContain("Banana");
      expect(triggers[2].text()).toContain("Cherry");
    });

    it("passes type and collapsible defaults through the root recipe", () => {
      const root = wrapper.findComponent({ name: "AccordionRoot" });
      expect(root.attributes("type")).toBe("single");
      expect(root.attributes("collapsible")).toBe("true");
    });
  });

  describe("conditional", () => {
    it("renders an icon when the item has one", () => {
      const wrapper = mountAccordion({ items: fakeOptionsWithIcons });
      const icons = wrapper.findAll("i");
      expect(icons.some((i) => i.attributes("alias") === "home")).toBe(true);
    });
  });

  describe("models", () => {
    it("binds modelValue down through the root recipe", () => {
      const wrapper = mountAccordion({ modelValue: "banana" });
      const root = wrapper.findComponent({ name: "AccordionRoot" });
      expect(root.attributes("modelvalue")).toBe("banana");
    });

    it("re-emits child updates and tracks them while uncontrolled", async () => {
      const wrapper = mountAccordion();
      wrapper
        .findComponent({ name: "AccordionRoot" })
        .vm.$emit("update:modelValue", "cherry");
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([["cherry"]]);
      const root = wrapper.findComponent({ name: "AccordionRoot" });
      expect(root.attributes("modelvalue")).toBe("cherry");
    });
  });

  describe("ctx", () => {
    it("exposes a writable model ref", async () => {
      const wrapper = mountAccordion();
      wrapper.vm.ctx.modelValue.value = "cherry";
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([["cherry"]]);
      const root = wrapper.findComponent({ name: "AccordionRoot" });
      expect(root.attributes("modelvalue")).toBe("cherry");
    });
  });

  describe("passthrough", () => {
    it("pt.root merges flat onto the root part", () => {
      const wrapper = mountAccordion({ pt: { root: { class: "custom-root" } } });
      const root = wrapper.findComponent({ name: "AccordionRoot" });
      expect(root.classes()).toContain("custom-root");
    });

    it("a user iter callback replaces the local item recipe", () => {
      const wrapper = mountAccordion({
        pt: { item: (option) => ({ value: option.value, class: "custom-item" }) },
      });
      const items = wrapper.findAllComponents({ name: "AccordionItem" });
      expect(items).toHaveLength(3);
      items.forEach((item) => {
        expect(item.classes()).toContain("custom-item");
      });
    });
  });

  describe("slots", () => {
    it("content slot renders inside each item", () => {
      const wrapper = mountAccordion({}, { content: "<b class=\"panel-body\"></b>" });
      expect(wrapper.findAll(".panel-body")).toHaveLength(3);
    });

    it("trigger slot overrides the default trigger content", () => {
      const wrapper = mountAccordion({}, { trigger: "<b class=\"custom-trigger\"></b>" });
      expect(wrapper.findAll(".custom-trigger")).toHaveLength(3);
      const triggers = wrapper.findAllComponents({ name: "AccordionTrigger" });
      expect(triggers[0].text()).not.toContain("Apple");
    });
  });
});
