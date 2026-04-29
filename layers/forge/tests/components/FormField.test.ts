import { describe, it, expect } from "vitest";
import { mountFormField } from "../fixtures";
import { createMockForm } from "../../../../packages/testing/helpers/mock-form";

describe("DataFormField", () => {
  describe("static", () => {
    const wrapper = mountFormField();

    it("renders root with f-data-form-field class", () => {
      expect(wrapper.find(".f-data-form-field").exists()).toBe(true);
    });

    it("sets grid-column span from colspan", () => {
      expect(wrapper.find(".f-data-form-field").attributes("style")).toContain("grid-column: span 6");
    });

    it("renders label with f-data-form-field-label class", () => {
      expect(wrapper.find(".f-data-form-field-label").exists()).toBe(true);
      expect(wrapper.find(".f-data-form-field-label").text()).toBe("Name");
    });

    it("renders Input for text type", () => {
      expect(wrapper.findComponent({ name: "Input" }).exists()).toBe(true);
    });
  });

  describe("field types", () => {
    it("renders Input for email type", () => {
      const wrapper = mountFormField({ field: { key: "email", type: "email", label: "Email", colspan: 6 } });
      expect(wrapper.findComponent({ name: "Input" }).exists()).toBe(true);
    });

    it("renders Textarea for textarea type", () => {
      const wrapper = mountFormField({ field: { key: "name", type: "textarea", label: "Bio", colspan: 12 } });
      expect(wrapper.findComponent({ name: "Textarea" }).exists()).toBe(true);
    });

    it("renders Select for select type", () => {
      const wrapper = mountFormField({
        field: { key: "name", type: "select", label: "Role", colspan: 6, options: [{ value: "a", label: "A" }] },
      });
      expect(wrapper.findComponent({ name: "Select" }).exists()).toBe(true);
    });

    it("renders Checkbox for checkbox type", () => {
      const wrapper = mountFormField({ field: { key: "active", type: "checkbox", label: "Active", colspan: 12 } });
      expect(wrapper.findComponent({ name: "Checkbox" }).exists()).toBe(true);
    });

    it("renders Radio for radio type", () => {
      const wrapper = mountFormField({
        field: { key: "name", type: "radio", label: "Dept", colspan: 6, options: [{ value: "a", label: "A" }] },
      });
      expect(wrapper.findComponent({ name: "Radio" }).exists()).toBe(true);
    });

    it("renders DatePicker for date type", () => {
      const wrapper = mountFormField({ field: { key: "name", type: "date", label: "Date", colspan: 6 } });
      expect(wrapper.findComponent({ name: "DatePicker" }).exists()).toBe(true);
    });

    it("renders TagsInput for tags-input type", () => {
      const wrapper = mountFormField({ field: { key: "name", type: "tags-input", label: "Tags", colspan: 6 } });
      expect(wrapper.findComponent({ name: "TagsInput" }).exists()).toBe(true);
    });
  });

  describe("errors", () => {
    it("does not show error when field is untouched", () => {
      const form = createMockForm({ errors: { name: "Required" } });
      const wrapper = mountFormField({ form });
      expect(wrapper.find(".f-data-form-field-error").exists()).toBe(false);
    });

    it("shows error when field is touched and has error", () => {
      const form = createMockForm({ errors: { name: "Required" }, touched: new Set(["name"]) });
      const wrapper = mountFormField({ form });
      expect(wrapper.find(".f-data-form-field-error").exists()).toBe(true);
      expect(wrapper.find(".f-data-form-field-error").text()).toBe("Required");
    });
  });

  describe("colspan", () => {
    it("defaults to span 12 when no colspan specified", () => {
      const wrapper = mountFormField({ field: { key: "name", type: "text", label: "Name" } });
      expect(wrapper.find(".f-data-form-field").attributes("style")).toContain("grid-column: span 12");
    });
  });
});
