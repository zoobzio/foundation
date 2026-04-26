import { describe, it, expect } from "vitest";
import { mountToast } from "../fixtures";

describe("Toast", () => {
  describe("static", () => {
    const wrapper = mountToast();

    it("renders root with f-toast class", () => {
      expect(wrapper.find(".f-toast").exists()).toBe(true);
    });

    it("renders title", () => {
      expect(wrapper.find(".f-toast-title").text()).toContain("Test Toast");
    });

    it("renders description", () => {
      expect(wrapper.find(".f-toast-description").text()).toContain("Test description");
    });

    it("renders close button with Icon", () => {
      expect(wrapper.find(".f-toast-close").exists()).toBe(true);
      expect(wrapper.find(".f-toast-close i").exists()).toBe(true);
    });

    it("defaults data-variant to info", () => {
      expect(wrapper.find(".f-toast").attributes("data-variant")).toBe("info");
    });
  });

  describe("conditional", () => {
    it("does not render title when absent", () => {
      const wrapper = mountToast({ title: undefined });
      expect(wrapper.findComponent({ name: "ToastTitle" }).exists()).toBe(false);
    });

    it("does not render description when absent", () => {
      const wrapper = mountToast({ description: undefined });
      expect(wrapper.findComponent({ name: "ToastDescription" }).exists()).toBe(false);
    });
  });

  describe("interaction", () => {
    it("emits close when ToastRoot update:open fires with false", async () => {
      const { nextTick } = await import("vue");
      const wrapper = mountToast();
      wrapper.findComponent({ name: "ToastRoot" }).vm.$emit("update:open", false);
      await nextTick();
      expect(wrapper.emitted("close")).toBeTruthy();
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountToast({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-toast").classes()).toContain("custom");
    });
  });
});
