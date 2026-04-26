import { describe, it, expect } from "vitest";
import { mountCommand } from "../fixtures";

describe("Command", () => {
  describe("static", () => {
    const wrapper = mountCommand();

    it("renders root with f-command-root class", () => {
      expect(wrapper.find(".f-command-root").exists()).toBe(true);
    });

    it("renders filter with f-command-input class", () => {
      expect(wrapper.find(".f-command-input").exists()).toBe(true);
    });

    it("renders visible items", () => {
      const items = wrapper.findAll(".f-command-item");
      expect(items.length).toBeGreaterThan(0);
    });
  });

  describe("conditional", () => {
    it("renders Checkbox when multiple=true", () => {
      const wrapper = mountCommand({ multiple: true });
      expect(wrapper.findComponent({ name: "Checkbox" }).exists()).toBe(true);
    });

    it("does not render Checkbox when multiple=false", () => {
      const wrapper = mountCommand({ multiple: false });
      expect(wrapper.findComponent({ name: "Checkbox" }).exists()).toBe(false);
    });

    it("shows empty message when no results match", () => {
      const wrapper = mountCommand({ searchTerm: "zzzzz" });
      expect(wrapper.text()).toContain("No results found");
    });
  });

  describe("interaction", () => {
    it("updates selected via ListboxRoot emit", async () => {
      const { nextTick } = await import("vue");
      const wrapper = mountCommand({ multiple: true });
      wrapper.findComponent({ name: "ListboxRoot" }).vm.$emit("update:modelValue", ["apple", "cherry"]);
      await nextTick();
      expect(wrapper.emitted("update:selected")).toBeTruthy();
    });

    it("emits select in single-select mode", async () => {
      const { nextTick } = await import("vue");
      const wrapper = mountCommand({ multiple: false });
      wrapper.findComponent({ name: "ListboxRoot" }).vm.$emit("update:modelValue", "apple");
      await nextTick();
      expect(wrapper.emitted("select")?.[0]).toEqual(["apple"]);
    });

    it("updates searchTerm via ListboxFilter emit", async () => {
      const { nextTick } = await import("vue");
      const wrapper = mountCommand();
      wrapper.findComponent({ name: "ListboxFilter" }).vm.$emit("update:modelValue", "ban");
      await nextTick();
      expect(wrapper.emitted("update:searchTerm")?.[0]).toEqual(["ban"]);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountCommand({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-command-root").classes()).toContain("custom");
    });
  });
});
