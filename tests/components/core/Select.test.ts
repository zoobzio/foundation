import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountSelect } from "#test/support/fixtures/components";

// Core tests stub the tier below: the behavioral element wrappers are replaced
// by name, so assertions target the stubs' bound props/attrs, not wrapper DOM.
describe("Select", () => {
  describe("static", () => {
    const wrapper = mountSelect();

    it("renders the root part", () => {
      expect(wrapper.findComponent({ name: "SelectRoot" }).exists()).toBe(true);
    });

    it("shows placeholder when no selection", () => {
      expect(wrapper.find("span").text()).toContain("Select an option");
    });

    it("binds open=false down by default", () => {
      const root = wrapper.findComponent({ name: "SelectRoot" });
      expect(root.attributes("open")).toBe("false");
    });

    it("renders an item per option through the iter recipe", () => {
      const items = wrapper.findAllComponents({ name: "SelectItem" });
      expect(items).toHaveLength(3);
      expect(items.map((i) => i.attributes("value"))).toEqual([
        "apple",
        "banana",
        "cherry",
      ]);
    });
  });

  describe("models", () => {
    it("shows the selected label when modelValue matches", () => {
      const wrapper = mountSelect({ modelValue: { value: "banana", label: "Banana" } });
      expect(wrapper.find("span").text()).toContain("Banana");
    });

    it("re-emits the child selection as the matched option and displays it (uncontrolled)", async () => {
      const wrapper = mountSelect();
      // reka emits the raw value; the core resolves it to the full option.
      wrapper
        .findComponent({ name: "SelectRoot" })
        .vm.$emit("update:modelValue", "banana");
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([[{ value: "banana", label: "Banana" }]]);
      expect(wrapper.find("span").text()).toContain("Banana");
    });

    it("flips the trigger icon from child open state (uncontrolled)", async () => {
      const wrapper = mountSelect();
      expect(wrapper.find("i").attributes("alias")).toBe("chevron-down");
      wrapper
        .findComponent({ name: "SelectRoot" })
        .vm.$emit("update:open", true);
      await nextTick();
      expect(wrapper.emitted("update:open")).toEqual([[true]]);
      expect(wrapper.find("i").attributes("alias")).toBe("chevron-up");
    });

    it("supports v-model:open as a controlled prop", () => {
      const wrapper = mountSelect({ open: true });
      const root = wrapper.findComponent({ name: "SelectRoot" });
      expect(root.attributes("open")).toBe("true");
      expect(wrapper.find("i").attributes("alias")).toBe("chevron-up");
    });

    it("stays pinned to the open prop while controlled", async () => {
      const wrapper = mountSelect({ open: false });
      wrapper
        .findComponent({ name: "SelectRoot" })
        .vm.$emit("update:open", true);
      await nextTick();
      expect(wrapper.emitted("update:open")).toEqual([[true]]);
      expect(wrapper.find("i").attributes("alias")).toBe("chevron-down");
    });
  });

  describe("ctx", () => {
    it("exposes writable model refs", async () => {
      const wrapper = mountSelect();
      wrapper.vm.ctx.open.value = true;
      await nextTick();
      expect(wrapper.emitted("update:open")).toEqual([[true]]);
      expect(wrapper.find("i").attributes("alias")).toBe("chevron-up");

      wrapper.vm.ctx.modelValue.value = { value: "cherry", label: "Cherry" };
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([[{ value: "cherry", label: "Cherry" }]]);
      expect(wrapper.find("span").text()).toContain("Cherry");
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto the root part", () => {
      const wrapper = mountSelect({ pt: { root: { class: "custom" } } });
      const root = wrapper.findComponent({ name: "SelectRoot" });
      expect(root.classes()).toContain("custom");
      expect(root.attributes("open")).toBe("false");
    });

    it("user pt wins over the local recipe per key", () => {
      const wrapper = mountSelect({ pt: { content: { sideOffset: 8 } } });
      const content = wrapper.findComponent({ name: "SelectContent" });
      expect(content.attributes("sideoffset")).toBe("8");
      expect(content.attributes("position")).toBe("popper");
    });
  });

  describe("slots", () => {
    it("trigger slot overrides default", () => {
      const wrapper = mountSelect({}, { trigger: "<div class=\"custom-trigger\">Pick one</div>" });
      expect(wrapper.find(".custom-trigger").exists()).toBe(true);
    });
  });
});
