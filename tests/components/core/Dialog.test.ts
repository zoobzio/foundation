import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountDialog } from "#test/support/fixtures/components";

// Core tests stub the tier below: the behavioral element wrappers are replaced
// by name, so assertions target the stubs' bound props/attrs.
describe("Dialog", () => {
  describe("static", () => {
    const wrapper = mountDialog();

    it("renders the root part with open=false by default", () => {
      const root = wrapper.findComponent({ name: "DialogRoot" });
      expect(root.exists()).toBe(true);
      expect(root.attributes("open")).toBe("false");
    });

    it("renders the overlay part", () => {
      expect(wrapper.findComponent({ name: "DialogOverlay" }).exists()).toBe(true);
    });

    it("renders title and description text", () => {
      expect(wrapper.findComponent({ name: "DialogTitle" }).text()).toContain("Test Dialog");
      expect(wrapper.findComponent({ name: "DialogDescription" }).text()).toContain("Test description");
    });
  });

  describe("models", () => {
    it("supports v-model:open as a controlled prop", () => {
      const wrapper = mountDialog({ open: true });
      const root = wrapper.findComponent({ name: "DialogRoot" });
      expect(root.attributes("open")).toBe("true");
    });

    it("re-emits child open state while uncontrolled", async () => {
      const wrapper = mountDialog();
      wrapper.findComponent({ name: "DialogRoot" }).vm.$emit("update:open", true);
      await nextTick();
      expect(wrapper.emitted("update:open")).toEqual([[true]]);
      const root = wrapper.findComponent({ name: "DialogRoot" });
      expect(root.attributes("open")).toBe("true");
    });

    it("stays pinned to the open prop while controlled", async () => {
      const wrapper = mountDialog({ open: false });
      wrapper.findComponent({ name: "DialogRoot" }).vm.$emit("update:open", true);
      await nextTick();
      expect(wrapper.emitted("update:open")).toEqual([[true]]);
      const root = wrapper.findComponent({ name: "DialogRoot" });
      expect(root.attributes("open")).toBe("false");
    });
  });

  describe("ctx", () => {
    it("exposes a writable open ref", async () => {
      const wrapper = mountDialog();
      wrapper.vm.ctx.open.value = true;
      await nextTick();
      expect(wrapper.emitted("update:open")).toEqual([[true]]);
      const root = wrapper.findComponent({ name: "DialogRoot" });
      expect(root.attributes("open")).toBe("true");
    });
  });

  describe("passthrough", () => {
    it("pt.content merges onto the content part", () => {
      const wrapper = mountDialog({ pt: { content: { class: "custom" } } });
      const content = wrapper.findComponent({ name: "DialogContent" });
      expect(content.classes()).toContain("custom");
    });

    it("pt.root merges onto the root part", () => {
      const wrapper = mountDialog({ pt: { root: { modal: false } } });
      const root = wrapper.findComponent({ name: "DialogRoot" });
      expect(root.attributes("modal")).toBe("false");
    });
  });

  describe("slots", () => {
    it("default slot renders inside the content part", () => {
      const wrapper = mountDialog({}, { default: "<p>Body</p>" });
      const content = wrapper.findComponent({ name: "DialogContent" });
      expect(content.find("p").text()).toBe("Body");
    });

    it("overlay slot overrides default", () => {
      const wrapper = mountDialog({}, { overlay: "<div class=\"custom-overlay\"></div>" });
      expect(wrapper.find(".custom-overlay").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "DialogOverlay" }).exists()).toBe(false);
    });

    it("content slot overrides the whole content part", () => {
      const wrapper = mountDialog({}, { content: "<div class=\"custom-content\"></div>" });
      expect(wrapper.find(".custom-content").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "DialogContent" }).exists()).toBe(false);
    });

    it("title and description slots override defaults", () => {
      const wrapper = mountDialog({}, {
        title: "<b class=\"custom-title\"></b>",
        description: "<b class=\"custom-description\"></b>",
      });
      expect(wrapper.find(".custom-title").exists()).toBe(true);
      expect(wrapper.find(".custom-description").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "DialogTitle" }).exists()).toBe(false);
      expect(wrapper.findComponent({ name: "DialogDescription" }).exists()).toBe(false);
    });
  });
});
