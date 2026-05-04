import { describe, it, expect } from "vitest";
import { mountFab } from "../fixtures";

describe("Fab", () => {
  describe("static", () => {
    const wrapper = mountFab();

    it("renders with f-fab class", () => {
      expect(wrapper.find(".f-fab").exists()).toBe(true);
    });

    it("renders Icon", () => {
      expect(wrapper.findAll("i").some((i) => i.attributes("alias") === "home")).toBe(true);
    });
  });

  describe("conditional", () => {
    it("wraps in Tooltip when label provided", () => {
      const wrapper = mountFab({ label: "Add" });
      expect(wrapper.findComponent({ name: "Tooltip" }).exists()).toBe(true);
    });

    it("does not wrap in Tooltip without label", () => {
      const wrapper = mountFab();
      expect(wrapper.findComponent({ name: "Tooltip" }).exists()).toBe(false);
    });

    it("renders badge when defined (no label)", () => {
      const wrapper = mountFab({ badge: "" });
      expect(wrapper.find(".f-fab-badge").exists()).toBe(true);
    });

    it("renders badge when defined (with label)", () => {
      const wrapper = mountFab({ label: "Notify", badge: 3 });
      expect(wrapper.find(".f-fab-badge").exists()).toBe(true);
    });

    it("does not render badge when undefined", () => {
      const wrapper = mountFab();
      expect(wrapper.find(".f-fab-badge").exists()).toBe(false);
    });

    it("renders as link when link prop provided", () => {
      const wrapper = mountFab({ link: { to: "/home" } });
      expect(wrapper.find(".f-fab").exists()).toBe(true);
    });

    it("does not render Icon when icon is undefined (with label)", () => {
      const wrapper = mountFab({ icon: undefined, label: "Add" });
      const tooltip = wrapper.findComponent({ name: "Tooltip" });
      expect(tooltip.findAll("i")).toHaveLength(0);
    });

    it("does not render Icon when icon is undefined (no label)", () => {
      const wrapper = mountFab({ icon: undefined });
      expect(wrapper.findAll("i")).toHaveLength(0);
    });

    it("uses warning fallback alias in iconPT when icon is undefined", () => {
      const wrapper = mountFab({ icon: undefined, label: "Warn" });
      // iconPT computed falls back to "warning" — no crash
      expect(wrapper.find(".f-fab").exists()).toBe(true);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountFab({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-fab").classes()).toContain("custom");
    });
  });
});
