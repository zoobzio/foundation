import { describe, it, expect } from "vitest";
import { mountTooltip } from "#test/support/fixtures/components";

describe("Tooltip", () => {
  describe("static", () => {
    const wrapper = mountTooltip({}, { default: "<button>Hover me</button>" });

    it("renders TooltipRoot", () => {
      expect(wrapper.findComponent({ name: "TooltipRoot" }).exists()).toBe(true);
    });

    it("renders content text with f-tooltip-content class", () => {
      const content = wrapper.find(".f-tooltip-content");
      expect(content.exists()).toBe(true);
      expect(content.text()).toContain("Tooltip text");
    });

    it("renders default slot inside trigger", () => {
      expect(wrapper.findComponent({ name: "TooltipTrigger" }).text()).toContain("Hover me");
    });

    it("passes default prop values", () => {
      expect(wrapper.findComponent({ name: "TooltipRoot" }).attributes("delayduration")).toBe("0");
      expect(wrapper.find(".f-tooltip-content").attributes("sideoffset")).toBe("10");
    });
  });

  describe("passthrough", () => {
    it("pt.content merges onto content", () => {
      const wrapper = mountTooltip({ pt: { content: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-tooltip-content").classes()).toContain("custom");
    });
  });

  describe("slots", () => {
    it("content slot overrides default", () => {
      const wrapper = mountTooltip({}, { content: "<em>Custom</em>" });
      expect(wrapper.find(".f-tooltip-content em").text()).toBe("Custom");
    });
  });
});
