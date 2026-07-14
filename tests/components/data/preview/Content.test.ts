import { describe, it, expect } from "vitest";
import { mountPreviewContent } from "#test/support/fixtures/data";

describe("DataPreviewContent", () => {
  describe("static", () => {
    const wrapper = mountPreviewContent();

    it("renders root with f-data-preview-content class", () => {
      expect(wrapper.find(".f-data-preview-content").exists()).toBe(true);
    });

    it("renders Scroller", () => {
      expect(wrapper.find(".f-data-preview-content-scroller").exists()).toBe(true);
    });

    it("renders CodeView inside Scroller", () => {
      expect(wrapper.find(".f-data-preview-content-code-view").exists()).toBe(true);
    });

    it("renders footer with f-data-preview-content-footer class", () => {
      expect(wrapper.find(".f-data-preview-content-footer").exists()).toBe(true);
    });

    it("renders language badge in footer", () => {
      expect(wrapper.find(".f-data-preview-content-language").exists()).toBe(true);
    });

    it("renders search input in footer", () => {
      expect(wrapper.find(".f-data-preview-content-search-input").exists()).toBe(true);
    });

    it("renders info in footer", () => {
      const info = wrapper.find(".f-data-preview-content-info");
      expect(info.exists()).toBe(true);
      expect(info.text()).toContain("lines");
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountPreviewContent({
        pt: { root: { props: { class: "custom" } } },
      });
      expect(wrapper.find(".f-data-preview-content").classes()).toContain("custom");
    });

    it("pt.footer merges onto footer", () => {
      const wrapper = mountPreviewContent({
        pt: { footer: { props: { class: "custom-footer" } } },
      });
      expect(wrapper.find(".f-data-preview-content-footer").classes()).toContain("custom-footer");
    });
  });
});
