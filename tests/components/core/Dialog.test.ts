import { describe, it, expect } from "vitest";
import { mountDialog } from "#test/support/fixtures/components";

describe("Dialog", () => {
  describe("static", () => {
    const wrapper = mountDialog({ open: true });

    it("renders DialogRoot", () => {
      expect(wrapper.findComponent({ name: "DialogRoot" }).exists()).toBe(true);
    });

    it("renders overlay with f-dialog-overlay class", () => {
      expect(wrapper.find(".f-dialog-overlay").exists()).toBe(true);
    });

    it("renders content with f-dialog-content class", () => {
      expect(wrapper.find(".f-dialog-content").exists()).toBe(true);
    });

    it("renders title text", () => {
      expect(wrapper.find(".f-dialog-title").text()).toContain("Test Dialog");
    });

    it("renders description text", () => {
      expect(wrapper.find(".f-dialog-description").text()).toContain("Test description");
    });
  });

  describe("passthrough", () => {
    it("pt.content merges onto content", () => {
      const wrapper = mountDialog({ pt: { content: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-dialog-content").classes()).toContain("custom");
    });
  });

  describe("slots", () => {
    it("default slot renders in content", () => {
      const wrapper = mountDialog({}, { default: "<div class=\"dialog-body\">Body</div>" });
      expect(wrapper.find(".f-dialog-content .dialog-body").exists()).toBe(true);
    });

    it("title slot overrides default", () => {
      const wrapper = mountDialog({}, { title: "<span class=\"custom-title\">Override</span>" });
      expect(wrapper.find(".custom-title").text()).toBe("Override");
    });

    it("overlay slot overrides default", () => {
      const wrapper = mountDialog({}, { overlay: "<div class=\"custom-overlay\">OV</div>" });
      expect(wrapper.find(".custom-overlay").exists()).toBe(true);
    });
  });
});
