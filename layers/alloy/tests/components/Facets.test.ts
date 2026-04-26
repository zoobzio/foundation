import { describe, it, expect } from "vitest";
import { mountFacets } from "../fixtures";

describe("Facets", () => {
  describe("static", () => {
    const wrapper = mountFacets();

    it("renders Popover as root", () => {
      expect(wrapper.findComponent({ name: "Popover" }).exists()).toBe(true);
    });

    it("renders Fab as trigger", () => {
      expect(wrapper.findComponent({ name: "Fab" }).exists()).toBe(true);
    });

    it("renders Command as content", () => {
      expect(wrapper.findComponent({ name: "Command" }).exists()).toBe(true);
    });
  });

  describe("interaction", () => {
    it("updates open via Popover emit", async () => {
      const { nextTick } = await import("vue");
      const wrapper = mountFacets();
      wrapper.findComponent({ name: "Popover" }).vm.$emit("update:open", true);
      await nextTick();
    });

    it("updates selected via Command emit", async () => {
      const { nextTick } = await import("vue");
      const wrapper = mountFacets();
      wrapper.findComponent({ name: "Command" }).vm.$emit("update:selected", new Set(["active"]));
      await nextTick();
      expect(wrapper.emitted("update:selected")).toBeTruthy();
    });

    it("closes on escape keydown on Command", async () => {
      const { nextTick } = await import("vue");
      const wrapper = mountFacets();
      wrapper.findComponent({ name: "Popover" }).vm.$emit("update:open", true);
      await nextTick();
      wrapper.findComponent({ name: "Command" }).trigger("keydown", { key: "Escape" });
      await nextTick();
    });
  });

  describe("passthrough", () => {
    it("pt.popover merges onto Popover", () => {
      const wrapper = mountFacets({ pt: { popover: { props: { class: "custom" } } } });
      expect(wrapper.findComponent({ name: "Popover" }).classes()).toContain("custom");
    });
  });
});
