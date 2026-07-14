import { describe, it, expect } from "vitest";
import { mountFormWidget, mockForm } from "#test/support/fixtures/data";

describe("DataFormWidget", () => {
  describe("static", () => {
    const wrapper = mountFormWidget();

    it("renders root with f-data-form class", () => {
      expect(wrapper.find(".f-data-form").exists()).toBe(true);
    });

    it("renders toolbar with f-data-form-toolbar class", () => {
      expect(wrapper.find(".f-data-form-toolbar").exists()).toBe(true);
    });

    it("renders title", () => {
      expect(wrapper.find(".f-data-form-title").text()).toBe("Test Form");
    });

    it("renders Scroller", () => {
      expect(wrapper.findComponent({ name: "Scroller" }).exists()).toBe(true);
    });

    it("renders footer with f-data-form-footer class", () => {
      expect(wrapper.find(".f-data-form-footer").exists()).toBe(true);
    });

    it("renders submit button", () => {
      expect(wrapper.find(".f-data-form-submit").exists()).toBe(true);
      expect(wrapper.find(".f-data-form-submit").text()).toBe("Submit");
    });

    it("renders reset button", () => {
      expect(wrapper.find(".f-data-form-reset").exists()).toBe(true);
      expect(wrapper.find(".f-data-form-reset").text()).toBe("Reset");
    });

    it("delegates to DataFormField for each field", () => {
      const fields = wrapper.findAllComponents({ name: "DataFormField" });
      expect(fields.length).toBe(3);
    });
  });

  describe("behavior", () => {
    it("submit button is disabled when submitting", () => {
      const form = mockForm();
      form.submitting.value = true;
      const wrapper = mountFormWidget({ form });
      expect(wrapper.find(".f-data-form-submit").attributes("disabled")).toBeDefined();
    });

    it("submit button shows Submitting... when submitting", () => {
      const form = mockForm();
      form.submitting.value = true;
      const wrapper = mountFormWidget({ form });
      expect(wrapper.find(".f-data-form-submit").text()).toBe("Submitting...");
    });

    it("reset button calls form.reset", async () => {
      const form = mockForm();
      const wrapper = mountFormWidget({ form });
      await wrapper.find(".f-data-form-reset").trigger("click");
      expect(form.reset).toHaveBeenCalled();
    });
  });
});
