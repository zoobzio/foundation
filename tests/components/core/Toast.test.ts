import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountToast } from "#test/support/fixtures/components";

// Core tests stub the tier below: the behavioral element wrappers are replaced
// by name, so assertions target the stubs' bound props/attrs, not wrapper DOM.
describe("Toast", () => {
  describe("static", () => {
    const wrapper = mountToast();

    it("renders the root part", () => {
      expect(wrapper.findComponent({ name: "ToastRoot" }).exists()).toBe(true);
    });

    it("renders the title part", () => {
      expect(wrapper.findComponent({ name: "ToastTitle" }).text()).toContain("Test Toast");
    });

    it("renders the description part", () => {
      expect(wrapper.findComponent({ name: "ToastDescription" }).text()).toContain("Test description");
    });

    it("renders the close part with the close icon", () => {
      const close = wrapper.findComponent({ name: "ToastClose" });
      expect(close.exists()).toBe(true);
      expect(close.find("i").attributes("alias")).toBe("close");
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

  describe("models", () => {
    it("emits update:open and close when the root closes", async () => {
      const wrapper = mountToast();
      wrapper.findComponent({ name: "ToastRoot" }).vm.$emit("update:open", false);
      await nextTick();
      expect(wrapper.emitted("update:open")).toEqual([[false]]);
      expect(wrapper.emitted("close")).toEqual([[]]);
    });

    it("does not emit close when the root opens", async () => {
      const wrapper = mountToast();
      wrapper.findComponent({ name: "ToastRoot" }).vm.$emit("update:open", true);
      await nextTick();
      expect(wrapper.emitted("update:open")).toEqual([[true]]);
      expect(wrapper.emitted("close")).toBeUndefined();
    });

    it("stays pinned to the open prop while controlled", async () => {
      const wrapper = mountToast({ open: true });
      wrapper.findComponent({ name: "ToastRoot" }).vm.$emit("update:open", false);
      await nextTick();
      expect(wrapper.emitted("update:open")).toEqual([[false]]);
      const root = wrapper.findComponent({ name: "ToastRoot" });
      expect(root.vm.$attrs.open).toBe(true);
    });
  });

  describe("ctx", () => {
    it("exposes a writable open ref", async () => {
      const wrapper = mountToast();
      wrapper.vm.ctx.open.value = false;
      await nextTick();
      expect(wrapper.emitted("update:open")).toEqual([[false]]);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto the root part", () => {
      const wrapper = mountToast({ pt: { root: { class: "custom" } } });
      expect(wrapper.findComponent({ name: "ToastRoot" }).classes()).toContain("custom");
    });

    it("pt.closeIcon overrides the icon alias", () => {
      const wrapper = mountToast({ pt: { closeIcon: { alias: "cross" } } });
      const close = wrapper.findComponent({ name: "ToastClose" });
      expect(close.find("i").attributes("alias")).toBe("cross");
    });
  });

  describe("slots", () => {
    it("title slot overrides the default", () => {
      const wrapper = mountToast({}, { title: "<em class=\"custom\">Custom</em>" });
      expect(wrapper.find("em.custom").text()).toBe("Custom");
      expect(wrapper.findComponent({ name: "ToastTitle" }).exists()).toBe(false);
    });

    it("close slot overrides the default close part", () => {
      const wrapper = mountToast({}, { close: "<button class=\"custom-close\"></button>" });
      expect(wrapper.find("button.custom-close").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "ToastClose" }).exists()).toBe(false);
    });
  });
});
