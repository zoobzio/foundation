import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountMultiSelect } from "#test/support/fixtures/components";

const apple = { value: "apple", label: "Apple" };
const banana = { value: "banana", label: "Banana" };
const cherry = { value: "cherry", label: "Cherry" };

// Core tests stub the tier below: the Select behavioral wrappers (SelectRoot,
// SelectItem, …) and the Checkbox core child are replaced by name, so
// assertions target the stubs' bound props/attrs. The model is the Option
// object array; the recipe binds the value keys down to reka and resolves
// emitted keys back to options.
describe("MultiSelect", () => {
  describe("static", () => {
    const wrapper = mountMultiSelect({ modelValue: [] });

    it("renders the root part", () => {
      expect(wrapper.findComponent({ name: "SelectRoot" }).exists()).toBe(true);
    });

    it("binds multiple selection on the root", () => {
      expect(wrapper.findComponent({ name: "SelectRoot" }).attributes("multiple")).toBe("true");
    });

    it("shows the placeholder when nothing is selected", () => {
      expect(wrapper.find("span").text()).toContain("Select options");
    });

    it("renders an item per option through the iter recipe", () => {
      const items = wrapper.findAllComponents({ name: "SelectItem" });
      expect(items).toHaveLength(3);
      expect(items.map((i) => i.attributes("value"))).toEqual(["apple", "banana", "cherry"]);
    });

    it("renders a Checkbox per option", () => {
      expect(wrapper.findAllComponents({ name: "Checkbox" })).toHaveLength(3);
    });
  });

  describe("display", () => {
    it("shows the item label when one is selected", () => {
      const wrapper = mountMultiSelect({ modelValue: [banana] });
      expect(wrapper.find("span").text()).toContain("Banana");
    });

    it("joins the selected labels when multiple are selected", () => {
      const wrapper = mountMultiSelect({ modelValue: [apple, cherry] });
      expect(wrapper.find("span").text()).toContain("Apple, Cherry");
    });
  });

  describe("interaction", () => {
    it("resolves child key updates back to options (toggling on)", async () => {
      const wrapper = mountMultiSelect({ modelValue: [apple] });
      // reka emits the value-key array; the core resolves it to options.
      wrapper
        .findComponent({ name: "SelectRoot" })
        .vm.$emit("update:modelValue", ["apple", "banana"]);
      await nextTick();
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([[apple, banana]]);
    });

    it("resolves child key updates back to options (toggling off)", async () => {
      const wrapper = mountMultiSelect({ modelValue: [apple, banana] });
      wrapper
        .findComponent({ name: "SelectRoot" })
        .vm.$emit("update:modelValue", ["banana"]);
      await nextTick();
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([[banana]]);
    });

    it("re-emits update:open from the root", async () => {
      const wrapper = mountMultiSelect({ modelValue: [] });
      wrapper.findComponent({ name: "SelectRoot" }).vm.$emit("update:open", true);
      await nextTick();
      expect(wrapper.emitted("update:open")?.[0]).toEqual([true]);
    });
  });

  describe("ctx", () => {
    it("exposes a writable model ref", async () => {
      // Uncontrolled (no modelValue prop) so the ref drives the display.
      const wrapper = mountMultiSelect();
      wrapper.vm.ctx.modelValue.value = [cherry];
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([[[cherry]]]);
      expect(wrapper.find("span").text()).toContain("Cherry");
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto the root part", () => {
      const wrapper = mountMultiSelect({ modelValue: [], pt: { root: { class: "custom" } } });
      expect(wrapper.findComponent({ name: "SelectRoot" }).classes()).toContain("custom");
    });
  });
});
