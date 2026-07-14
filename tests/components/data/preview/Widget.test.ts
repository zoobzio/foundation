import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountPreviewWidget, mockPreview } from "#test/support/fixtures/data";

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

  describe("toolbar actions", () => {
    it("renders copy Fab in actions", () => {
      const wrapper = mountPreviewWidget();
      const fabs = wrapper.findAllComponents({ name: "Fab" });
      const copyFab = fabs.find((f) => f.attributes("icon") === "copy");
      expect(copyFab).toBeDefined();
    });

    it("renders download Fab in actions", () => {
      const wrapper = mountPreviewWidget();
      const fabs = wrapper.findAllComponents({ name: "Fab" });
      const downloadFab = fabs.find((f) => f.attributes("icon") === "download");
      expect(downloadFab).toBeDefined();
    });

    it("renders external Fab when content type is code with externalUrl", () => {
      const preview = mockPreview({
        content: { type: "code", key: "content", language: "json", externalUrl: "https://example.com" },
      });
      const wrapper = mountPreviewWidget({ preview });
      const fabs = wrapper.findAllComponents({ name: "Fab" });
      const externalFab = fabs.find((f) => f.attributes("icon") === "external");
      expect(externalFab).toBeDefined();
    });

    it("does not render external Fab when content has no externalUrl", () => {
      const wrapper = mountPreviewWidget();
      const fabs = wrapper.findAllComponents({ name: "Fab" });
      const externalFab = fabs.find((f) => f.attributes("icon") === "external");
      expect(externalFab).toBeUndefined();
    });
  });

  describe("file actions", () => {
    let clipboardSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      clipboardSpy = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: clipboardSpy },
        writable: true,
        configurable: true,
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("copy Fab triggers clipboard write on click", async () => {
      const wrapper = mountPreviewWidget();
      const fabs = wrapper.findAllComponents({ name: "Fab" });
      const copyFab = fabs.find((f) => f.attributes("icon") === "copy");
      expect(copyFab).toBeDefined();
      if (!copyFab) return;
      await copyFab.trigger("click");
      expect(clipboardSpy).toHaveBeenCalledWith('{"key": "value"}');
    });

    it("download Fab triggers download on click", async () => {
      const createObjectURL = vi.fn().mockReturnValue("blob:url");
      const revokeObjectURL = vi.fn();
      vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });

      const clickSpy = vi.fn();
      const anchor = { href: "", download: "", click: clickSpy };
      const origCreate = document.createElement.bind(document);
      vi.spyOn(document, "createElement").mockImplementation((tag: string, options?: ElementCreationOptions) => {
        if (tag === "a") return anchor as unknown as HTMLElement;
        return origCreate(tag, options);
      });

      const wrapper = mountPreviewWidget();
      const fabs = wrapper.findAllComponents({ name: "Fab" });
      const downloadFab = fabs.find((f) => f.attributes("icon") === "download");
      expect(downloadFab).toBeDefined();
      if (!downloadFab) return;
      await downloadFab.trigger("click");

      expect(createObjectURL).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(revokeObjectURL).toHaveBeenCalledWith("blob:url");
    });

    it("openExternal Fab opens window on click", async () => {
      const openSpy = vi.fn();
      vi.stubGlobal("open", openSpy);

      const preview = mockPreview({
        content: { type: "code", key: "content", language: "json", externalUrl: "https://example.com/file" },
      });
      const wrapper = mountPreviewWidget({ preview });
      const fabs = wrapper.findAllComponents({ name: "Fab" });
      const externalFab = fabs.find((f) => f.attributes("icon") === "external");
      expect(externalFab).toBeDefined();
      if (!externalFab) return;
      await externalFab.trigger("click");

      expect(openSpy).toHaveBeenCalledWith("https://example.com/file", "_blank");
    });
  });

  describe("computed", () => {
    it("filename returns content.filename when available", () => {
      const preview = mockPreview({
        content: { type: "code", key: "content", language: "json", filename: "data.json" },
      });
      const wrapper = mountPreviewWidget({ preview });
      expect(wrapper.find(".f-data-preview-title").text()).toBe("data.json");
    });

    it("filename falls back to content.{language} when no filename", () => {
      const wrapper = mountPreviewWidget();
      expect(wrapper.find(".f-data-preview-title").text()).toBe("content.json");
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
