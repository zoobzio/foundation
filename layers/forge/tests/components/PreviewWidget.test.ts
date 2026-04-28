import { describe, it, expect } from "vitest";
import { mountPreviewWidget, mockPreview } from "../fixtures";

describe("DataPreviewWidget", () => {
  describe("static", () => {
    const wrapper = mountPreviewWidget();

    it("renders root with f-data-preview class", () => {
      expect(wrapper.find(".f-data-preview").exists()).toBe(true);
    });

    it("renders toolbar with f-data-preview-toolbar class", () => {
      expect(wrapper.find(".f-data-preview-toolbar").exists()).toBe(true);
    });

    it("renders filename in toolbar", () => {
      expect(wrapper.find(".f-data-preview-title").exists()).toBe(true);
    });

    it("renders file actions in toolbar", () => {
      expect(wrapper.find(".f-data-preview-actions").exists()).toBe(true);
    });

    it("renders body with f-data-preview-body class", () => {
      expect(wrapper.find(".f-data-preview-body").exists()).toBe(true);
    });

    it("delegates to DataPreviewFields", () => {
      expect(wrapper.findComponent({ name: "DataPreviewFields" }).exists()).toBe(true);
    });

    it("delegates to DataPreviewContent", () => {
      expect(wrapper.findComponent({ name: "DataPreviewContent" }).exists()).toBe(true);
    });
  });

  describe("conditional", () => {
    it("renders loading slot when loading", () => {
      const preview = mockPreview();
      preview.loading.value = true;
      const wrapper = mountPreviewWidget(
        { preview },
        { loading: "<div class=\"loading\">Loading...</div>" },
      );
      expect(wrapper.find(".loading").exists()).toBe(true);
    });

    it("renders empty slot when no data", () => {
      const preview = mockPreview({ data: null });
      const wrapper = mountPreviewWidget(
        { preview },
        { empty: "<div class=\"empty\">No data</div>" },
      );
      expect(wrapper.find(".empty").exists()).toBe(true);
    });

    it("hides toolbar and body when loading", () => {
      const preview = mockPreview();
      preview.loading.value = true;
      const wrapper = mountPreviewWidget({ preview });
      expect(wrapper.find(".f-data-preview-toolbar").exists()).toBe(false);
      expect(wrapper.find(".f-data-preview-body").exists()).toBe(false);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountPreviewWidget({
        pt: { root: { props: { class: "custom-root" } } },
      });
      expect(wrapper.find(".f-data-preview").classes()).toContain("custom-root");
    });

    it("pt.toolbar merges onto toolbar", () => {
      const wrapper = mountPreviewWidget({
        pt: { toolbar: { props: { class: "custom-toolbar" } } },
      });
      expect(wrapper.find(".f-data-preview-toolbar").classes()).toContain("custom-toolbar");
    });
  });
});
