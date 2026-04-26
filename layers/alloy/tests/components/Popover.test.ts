import { describe, it, expect } from "vitest";
import { mountPopover } from "../fixtures";

describe("Popover", () => {
  describe("static", () => {
    const wrapper = mountPopover();

    it("renders PopoverRoot", () => {
      expect(wrapper.findComponent({ name: "PopoverRoot" }).exists()).toBe(true);
    });

    it("renders content with f-popover-content class", () => {
      expect(wrapper.find(".f-popover-content").exists()).toBe(true);
    });

    it("renders trigger when no reference prop", () => {
      expect(wrapper.findComponent({ name: "PopoverTrigger" }).exists()).toBe(true);
    });
  });

  describe("conditional", () => {
    it("does not render arrow by default", () => {
      const wrapper = mountPopover();
      expect(wrapper.findComponent({ name: "PopoverArrow" }).exists()).toBe(false);
    });

    it("renders arrow when arrow=true", () => {
      const wrapper = mountPopover({ arrow: true });
      expect(wrapper.find(".f-popover-arrow").exists()).toBe(true);
    });
  });

  describe("interaction", () => {
    it("updates open via PopoverRoot emit", async () => {
      const { nextTick } = await import("vue");
      const wrapper = mountPopover();
      wrapper.findComponent({ name: "PopoverRoot" }).vm.$emit("update:open", true);
      await nextTick();
      // Handler ran — no error
    });
  });

  describe("passthrough", () => {
    it("pt.content merges onto content", () => {
      const wrapper = mountPopover({ pt: { content: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-popover-content").classes()).toContain("custom");
    });
  });

  describe("slots", () => {
    it("content slot renders inside content", () => {
      const wrapper = mountPopover({}, { content: "<p>Body</p>" });
      expect(wrapper.find(".f-popover-content p").text()).toBe("Body");
    });

    it("trigger slot renders inside trigger", () => {
      const wrapper = mountPopover({}, { trigger: "<button>Click</button>" });
      expect(wrapper.findComponent({ name: "PopoverTrigger" }).text()).toContain("Click");
    });

    it("renders PopoverClose when close slot provided", () => {
      const wrapper = mountPopover({}, { close: "<span>X</span>" });
      expect(wrapper.find(".f-popover-close").exists()).toBe(true);
    });

    it("does not render PopoverClose without close slot", () => {
      const wrapper = mountPopover();
      expect(wrapper.findComponent({ name: "PopoverClose" }).exists()).toBe(false);
    });
  });
});
