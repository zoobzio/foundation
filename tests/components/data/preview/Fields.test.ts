import { describe, it, expect } from "vitest";
import { mountPreviewFields } from "#test/support/fixtures/data";

describe("DataPreviewFields", () => {
  describe("static", () => {
    const wrapper = mountPreviewFields();

    it("renders root with f-data-preview-fields class", () => {
      expect(wrapper.find(".f-data-preview-fields").exists()).toBe(true);
    });

    it("renders a field group for each field", () => {
      expect(wrapper.findAll(".f-data-preview-field")).toHaveLength(4);
    });

    it("renders labels for each field", () => {
      const labels = wrapper.findAll(".f-data-preview-field-label");
      expect(labels).toHaveLength(4);
      expect(labels[0].text()).toBe("Title");
      expect(labels[1].text()).toBe("Status");
      expect(labels[2].text()).toBe("Language");
      expect(labels[3].text()).toBe("Summary");
    });

    it("renders text values as Span", () => {
      const values = wrapper.findAll(".f-data-preview-field-value");
      expect(values[0].text()).toBe("Test Document");
      expect(values[1].text()).toBe("Active");
      expect(values[2].text()).toBe("json");
    });

    it("renders markdown fields with Markdown component", () => {
      expect(wrapper.find(".f-data-preview-field-markdown").exists()).toBe(true);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountPreviewFields({
        pt: { root: { props: { class: "custom" } } },
      });
      expect(wrapper.find(".f-data-preview-fields").classes()).toContain("custom");
    });
  });
});
