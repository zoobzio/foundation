import { describe, it, expect } from "vitest";
import { mountFormField } from "../fixtures";
import { createMockForm } from "../helpers/mock-form";

describe("DataFormField", () => {
  // ---------------------------------------------------------------------------
  // Structure & defaults
  // ---------------------------------------------------------------------------

  describe("structure", () => {
    const wrapper = mountFormField();

    it("renders root with f-data-form-field class", () => {
      expect(wrapper.find(".f-data-form-field").exists()).toBe(true);
    });

    it("renders a Label with the field label text", () => {
      expect(wrapper.find(".f-data-form-field-label").exists()).toBe(true);
      expect(wrapper.find(".f-data-form-field-label").text()).toBe("Name");
    });
  });

  // ---------------------------------------------------------------------------
  // Colspan
  // ---------------------------------------------------------------------------

  describe("colspan", () => {
    it("sets grid-column span from colspan prop", () => {
      const wrapper = mountFormField({ field: { key: "name", type: "text", label: "Name", colspan: 6 } });
      expect(wrapper.find(".f-data-form-field").attributes("style")).toContain("grid-column: span 6");
    });

    it("defaults to span 12 when no colspan is specified", () => {
      const wrapper = mountFormField({ field: { key: "name", type: "text", label: "Name" } });
      expect(wrapper.find(".f-data-form-field").attributes("style")).toContain("grid-column: span 12");
    });
  });

  // ---------------------------------------------------------------------------
  // Field type rendering
  // ---------------------------------------------------------------------------

  describe("field types", () => {
    it("renders Input for text type", () => {
      const wrapper = mountFormField({ field: { key: "name", type: "text", label: "Name" } });
      expect(wrapper.findComponent({ name: "Input" }).exists()).toBe(true);
    });

    it("renders Input for email type", () => {
      const wrapper = mountFormField({ field: { key: "email", type: "email", label: "Email" } });
      expect(wrapper.findComponent({ name: "Input" }).exists()).toBe(true);
    });

    it("renders Input for password type", () => {
      const wrapper = mountFormField({ field: { key: "name", type: "password", label: "Password" } });
      expect(wrapper.findComponent({ name: "Input" }).exists()).toBe(true);
    });

    it("renders Input for number type", () => {
      const wrapper = mountFormField({ field: { key: "name", type: "number", label: "Age" } });
      expect(wrapper.findComponent({ name: "Input" }).exists()).toBe(true);
    });

    it("renders Textarea for textarea type", () => {
      const wrapper = mountFormField({ field: { key: "name", type: "textarea", label: "Bio" } });
      expect(wrapper.findComponent({ name: "Textarea" }).exists()).toBe(true);
    });

    it("renders Select for select type", () => {
      const wrapper = mountFormField({
        field: { key: "name", type: "select", label: "Role", options: [{ value: "a", label: "A" }] },
      });
      expect(wrapper.findComponent({ name: "Select" }).exists()).toBe(true);
    });

    it("renders MultiSelect for multi-select type", () => {
      const wrapper = mountFormField({
        field: { key: "name", type: "multi-select", label: "Roles", options: [{ value: "a", label: "A" }] },
      });
      expect(wrapper.findComponent({ name: "MultiSelect" }).exists()).toBe(true);
    });

    it("renders Checkbox for checkbox type", () => {
      const wrapper = mountFormField({ field: { key: "active", type: "checkbox", label: "Active" } });
      expect(wrapper.findComponent({ name: "Checkbox" }).exists()).toBe(true);
    });

    it("renders Radio for radio type", () => {
      const wrapper = mountFormField({
        field: { key: "name", type: "radio", label: "Dept", options: [{ value: "a", label: "A" }] },
      });
      expect(wrapper.findComponent({ name: "Radio" }).exists()).toBe(true);
    });

    it("renders DatePicker for date type", () => {
      const wrapper = mountFormField({ field: { key: "name", type: "date", label: "Date" } });
      expect(wrapper.findComponent({ name: "DatePicker" }).exists()).toBe(true);
    });

    it("renders TagsInput for tags-input type", () => {
      const wrapper = mountFormField({ field: { key: "name", type: "tags-input", label: "Tags" } });
      expect(wrapper.findComponent({ name: "TagsInput" }).exists()).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // Error display
  // ---------------------------------------------------------------------------

  describe("errors", () => {
    it("does not show error when field is untouched and has no error", () => {
      const form = createMockForm();
      const wrapper = mountFormField({ form });
      expect(wrapper.find(".f-data-form-field-error").exists()).toBe(false);
    });

    it("does not show error when field has error but is untouched", () => {
      const form = createMockForm({ errors: { name: "Required" } });
      const wrapper = mountFormField({ form });
      expect(wrapper.find(".f-data-form-field-error").exists()).toBe(false);
    });

    it("does not show error when field is touched but has no error", () => {
      const form = createMockForm({ touched: new Set(["name"]) });
      const wrapper = mountFormField({ form });
      expect(wrapper.find(".f-data-form-field-error").exists()).toBe(false);
    });

    it("shows error when field is touched AND has an error", () => {
      const form = createMockForm({ errors: { name: "Required" }, touched: new Set(["name"]) });
      const wrapper = mountFormField({ form });
      expect(wrapper.find(".f-data-form-field-error").exists()).toBe(true);
      expect(wrapper.find(".f-data-form-field-error").text()).toBe("Required");
    });
  });

  // ---------------------------------------------------------------------------
  // Event handlers — ore elements (Input, Textarea): native events
  // ---------------------------------------------------------------------------

  describe("event handlers (ore elements)", () => {
    it("calls form.touch and form.validateField on Input blur (text)", async () => {
      const form = createMockForm();
      const wrapper = mountFormField({ form, field: { key: "name", type: "text", label: "Name" } });
      await wrapper.findComponent({ name: "Input" }).trigger("blur");
      expect(form.touch).toHaveBeenCalledWith("name");
      expect(form.validateField).toHaveBeenCalledWith("name");
    });

    it("calls form.touch and form.validateField on Input blur (email)", async () => {
      const form = createMockForm();
      const wrapper = mountFormField({ form, field: { key: "email", type: "email", label: "Email" } });
      await wrapper.findComponent({ name: "Input" }).trigger("blur");
      expect(form.touch).toHaveBeenCalledWith("email");
      expect(form.validateField).toHaveBeenCalledWith("email");
    });

    it("calls form.touch and form.validateField on Input blur (password)", async () => {
      const form = createMockForm();
      const wrapper = mountFormField({ form, field: { key: "name", type: "password", label: "Password" } });
      await wrapper.findComponent({ name: "Input" }).trigger("blur");
      expect(form.touch).toHaveBeenCalledWith("name");
      expect(form.validateField).toHaveBeenCalledWith("name");
    });

    it("calls form.touch and form.validateField on Input blur (number)", async () => {
      const form = createMockForm();
      const wrapper = mountFormField({ form, field: { key: "name", type: "number", label: "Age" } });
      await wrapper.findComponent({ name: "Input" }).trigger("blur");
      expect(form.touch).toHaveBeenCalledWith("name");
      expect(form.validateField).toHaveBeenCalledWith("name");
    });

    it("calls form.touch and form.validateField on Textarea blur", async () => {
      const form = createMockForm();
      const wrapper = mountFormField({ form, field: { key: "name", type: "textarea", label: "Bio" } });
      await wrapper.findComponent({ name: "Textarea" }).trigger("blur");
      expect(form.touch).toHaveBeenCalledWith("name");
      expect(form.validateField).toHaveBeenCalledWith("name");
    });
  });

  // ---------------------------------------------------------------------------
  // Event handlers — alloy components: emit update:modelValue
  // ---------------------------------------------------------------------------

  describe("event handlers (alloy components)", () => {
    describe("Select", () => {
      it("calls form.setValue, form.touch, and form.validateField on update:modelValue", async () => {
        const form = createMockForm();
        const wrapper = mountFormField({
          form,
          field: { key: "name", type: "select", label: "Role", options: [{ value: "a", label: "A" }] },
        });
        const select = wrapper.findComponent({ name: "Select" });
        await select.vm.$emit("update:modelValue", "a");
        expect(form.setValue).toHaveBeenCalledWith("name", "a");
        expect(form.touch).toHaveBeenCalledWith("name");
        expect(form.validateField).toHaveBeenCalledWith("name");
      });
    });

    describe("MultiSelect", () => {
      it("calls form.setValue, form.touch, and form.validateField on update:modelValue", async () => {
        const form = createMockForm();
        const wrapper = mountFormField({
          form,
          field: { key: "name", type: "multi-select", label: "Roles", options: [{ value: "a", label: "A" }] },
        });
        const ms = wrapper.findComponent({ name: "MultiSelect" });
        await ms.vm.$emit("update:modelValue", ["a"]);
        expect(form.setValue).toHaveBeenCalledWith("name", ["a"]);
        expect(form.touch).toHaveBeenCalledWith("name");
        expect(form.validateField).toHaveBeenCalledWith("name");
      });
    });

    describe("Checkbox", () => {
      it("calls form.setValue, form.touch, and form.validateField on update:modelValue", async () => {
        const form = createMockForm();
        const wrapper = mountFormField({
          form,
          field: { key: "active", type: "checkbox", label: "Active" },
        });
        const cb = wrapper.findComponent({ name: "Checkbox" });
        await cb.vm.$emit("update:modelValue", true);
        expect(form.setValue).toHaveBeenCalledWith("active", true);
        expect(form.touch).toHaveBeenCalledWith("active");
        expect(form.validateField).toHaveBeenCalledWith("active");
      });
    });

    describe("Radio", () => {
      it("calls form.setValue, form.touch, and form.validateField on update:modelValue", async () => {
        const form = createMockForm();
        const wrapper = mountFormField({
          form,
          field: { key: "name", type: "radio", label: "Dept", options: [{ value: "a", label: "A" }] },
        });
        const radio = wrapper.findComponent({ name: "Radio" });
        await radio.vm.$emit("update:modelValue", "a");
        expect(form.setValue).toHaveBeenCalledWith("name", "a");
        expect(form.touch).toHaveBeenCalledWith("name");
        expect(form.validateField).toHaveBeenCalledWith("name");
      });
    });

    describe("DatePicker", () => {
      it("calls form.setValue, form.touch, and form.validateField on update:modelValue", async () => {
        const form = createMockForm();
        const wrapper = mountFormField({
          form,
          field: { key: "name", type: "date", label: "Date" },
        });
        const dp = wrapper.findComponent({ name: "DatePicker" });
        const dateVal = new Date("2026-01-01");
        await dp.vm.$emit("update:modelValue", dateVal);
        expect(form.setValue).toHaveBeenCalledWith("name", dateVal);
        expect(form.touch).toHaveBeenCalledWith("name");
        expect(form.validateField).toHaveBeenCalledWith("name");
      });
    });

    describe("TagsInput", () => {
      it("calls form.setValue, form.touch, and form.validateField on update:modelValue", async () => {
        const form = createMockForm();
        const wrapper = mountFormField({
          form,
          field: { key: "name", type: "tags-input", label: "Tags" },
        });
        const tags = wrapper.findComponent({ name: "TagsInput" });
        await tags.vm.$emit("update:modelValue", ["vue", "ts"]);
        expect(form.setValue).toHaveBeenCalledWith("name", ["vue", "ts"]);
        expect(form.touch).toHaveBeenCalledWith("name");
        expect(form.validateField).toHaveBeenCalledWith("name");
      });
    });
  });
});
