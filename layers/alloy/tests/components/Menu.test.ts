import { describe, it, expect } from "vitest";
import { mountMenu } from "../fixtures";

describe("Menu", () => {
  describe("static", () => {
    const wrapper = mountMenu();

    it("renders DropdownMenuRoot", () => {
      expect(wrapper.findComponent({ name: "DropdownMenuRoot" }).exists()).toBe(true);
    });

    it("renders content with f-menu-content class", () => {
      expect(wrapper.find(".f-menu-content").exists()).toBe(true);
    });

    it("renders item for each menu item", () => {
      expect(wrapper.findAll(".f-menu-item")).toHaveLength(4);
    });

    it("renders separator between groups", () => {
      expect(wrapper.findAllComponents({ name: "DropdownMenuSeparator" })).toHaveLength(1);
    });
  });

  describe("conditional", () => {
    it("renders group label when present", () => {
      const wrapper = mountMenu();
      const labels = wrapper.findAllComponents({ name: "DropdownMenuLabel" });
      expect(labels.length).toBeGreaterThan(0);
    });

    it("renders Icon when item has icon", () => {
      const wrapper = mountMenu();
      expect(wrapper.findAll("i").some((i) => i.attributes("alias") === "edit")).toBe(true);
    });

    it("does not render Icon when item has no icon", () => {
      const wrapper = mountMenu({
        groups: [{
          key: "plain",
          items: [{ label: "No Icon" }, { label: "Also No Icon" }],
        }],
      });
      const items = wrapper.findAllComponents({ name: "DropdownMenuItem" });
      expect(items).toHaveLength(2);
      // None of the items should have an Icon inside them
      expect(wrapper.findAll("i")).toHaveLength(0);
    });
  });

  describe("interaction", () => {
    it("updates open via DropdownMenuRoot emit", async () => {
      const { nextTick } = await import("vue");
      const wrapper = mountMenu();
      wrapper.findComponent({ name: "DropdownMenuRoot" }).vm.$emit("update:open", true);
      await nextTick();
      // Handler ran — no error
    });

    it("emits select when DropdownMenuItem select fires", async () => {
      const { nextTick } = await import("vue");
      const wrapper = mountMenu();
      const items = wrapper.findAllComponents({ name: "DropdownMenuItem" });
      items[0].vm.$emit("select");
      await nextTick();
      expect(wrapper.emitted("select")).toBeTruthy();
    });
  });

  describe("passthrough", () => {
    it("pt.content merges onto content", () => {
      const wrapper = mountMenu({ pt: { content: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-menu-content").classes()).toContain("custom");
    });
  });

  describe("slots", () => {
    it("default slot renders trigger content", () => {
      const wrapper = mountMenu({}, { default: "<button>Open Menu</button>" });
      expect(wrapper.findComponent({ name: "DropdownMenuTrigger" }).text()).toContain("Open Menu");
    });
  });
});
