import { describe, it, expect } from "vitest";
import { mountToaster } from "#test/support/fixtures/components";

// Core tests stub the tier below: the behavioral element wrappers are replaced
// by name, so assertions target the stubs' bound props/attrs, not wrapper DOM.
describe("Toaster", () => {
  describe("static", () => {
    const wrapper = mountToaster();

    it("renders the provider part", () => {
      expect(wrapper.findComponent({ name: "ToastProvider" }).exists()).toBe(true);
    });

    it("renders the viewport part", () => {
      expect(wrapper.findComponent({ name: "ToastViewport" }).exists()).toBe(true);
    });
  });

  describe("passthrough", () => {
    it("pt.provider merges onto the provider part", () => {
      const wrapper = mountToaster({ pt: { provider: { label: "Alerts" } } });
      const provider = wrapper.findComponent({ name: "ToastProvider" });
      expect(provider.attributes("label")).toBe("Alerts");
    });

    it("pt.viewport merges onto the viewport part", () => {
      const wrapper = mountToaster({ pt: { viewport: { class: "custom" } } });
      expect(wrapper.findComponent({ name: "ToastViewport" }).classes()).toContain("custom");
    });
  });

  describe("slots", () => {
    it("toasts slot renders content", () => {
      const wrapper = mountToaster({}, { toasts: "<div class=\"toast-item\">A toast</div>" });
      expect(wrapper.find(".toast-item").exists()).toBe(true);
    });

    it("viewport slot overrides the default viewport part", () => {
      const wrapper = mountToaster({}, { viewport: "<div class=\"custom-vp\">VP</div>" });
      expect(wrapper.find(".custom-vp").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "ToastViewport" }).exists()).toBe(false);
    });
  });
});
