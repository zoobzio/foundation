import { describe, it, expect } from "vitest";
import { mountToaster } from "#test/support/fixtures/components";

describe("Toaster", () => {
  describe("static", () => {
    const wrapper = mountToaster();

    it("renders ToastProvider", () => {
      expect(wrapper.findComponent({ name: "ToastProvider" }).exists()).toBe(true);
    });

    it("renders viewport with f-toast-viewport class", () => {
      expect(wrapper.find(".f-toast-viewport").exists()).toBe(true);
    });
  });

  describe("passthrough", () => {
    it("pt.provider merges onto provider", () => {
      const wrapper = mountToaster({ pt: { provider: { props: { class: "custom" } } } });
      expect(wrapper.findComponent({ name: "ToastProvider" }).classes()).toContain("custom");
    });
  });

  describe("slots", () => {
    it("toasts slot renders content", () => {
      const wrapper = mountToaster({}, { toasts: "<div class=\"toast-item\">A toast</div>" });
      expect(wrapper.find(".toast-item").exists()).toBe(true);
    });

    it("viewport slot overrides default", () => {
      const wrapper = mountToaster({}, { viewport: "<div class=\"custom-vp\">VP</div>" });
      expect(wrapper.find(".custom-vp").exists()).toBe(true);
    });
  });
});
