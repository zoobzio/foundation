import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountPopover } from "#test/support/fixtures/components";

// Core tests stub the tier below: the behavioral element wrappers are replaced
// by name, so assertions target the stubs' bound props/attrs.
describe("Popover", () => {
  describe("static", () => {
    const wrapper = mountPopover();

    it("renders the root part with open=false by default", () => {
      const root = wrapper.findComponent({ name: "PopoverRoot" });
      expect(root.exists()).toBe(true);
      expect(root.attributes("open")).toBe("false");
    });

    it("renders the trigger as-child when no reference", () => {
      const trigger = wrapper.findComponent({ name: "PopoverTrigger" });
      expect(trigger.exists()).toBe(true);
      expect(trigger.attributes("aschild")).toBe("true");
      expect(wrapper.findComponent({ name: "PopoverAnchor" }).exists()).toBe(false);
    });

    it("passes positioning defaults through the content recipe", () => {
      const content = wrapper.findComponent({ name: "PopoverContent" });
      expect(content.attributes("side")).toBe("bottom");
      expect(content.attributes("align")).toBe("center");
      expect(content.attributes("sideoffset")).toBe("10");
      expect(content.attributes("alignoffset")).toBe("0");
    });
  });

  describe("reference mode", () => {
    const reference = { getBoundingClientRect: () => ({}) };

    it("renders the anchor instead of the trigger", () => {
      const wrapper = mountPopover({ reference });
      expect(wrapper.findComponent({ name: "PopoverAnchor" }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: "PopoverTrigger" }).exists()).toBe(false);
    });
  });

  describe("conditional", () => {
    it("does not render arrow by default", () => {
      const wrapper = mountPopover();
      expect(wrapper.findComponent({ name: "PopoverArrow" }).exists()).toBe(false);
    });

    it("renders arrow when arrow=true", () => {
      const wrapper = mountPopover({ arrow: true });
      expect(wrapper.findComponent({ name: "PopoverArrow" }).exists()).toBe(true);
    });

    it("renders close only when the close slot is provided", () => {
      const without = mountPopover();
      expect(without.findComponent({ name: "PopoverClose" }).exists()).toBe(false);
      const with_ = mountPopover({}, { close: "<span>X</span>" });
      expect(with_.findComponent({ name: "PopoverClose" }).exists()).toBe(true);
    });
  });

  describe("models", () => {
    it("supports v-model:open as a controlled prop", () => {
      const wrapper = mountPopover({ open: true });
      const root = wrapper.findComponent({ name: "PopoverRoot" });
      expect(root.attributes("open")).toBe("true");
    });

    it("seeds the fallback from defaultOpen", () => {
      const wrapper = mountPopover({ defaultOpen: true });
      const root = wrapper.findComponent({ name: "PopoverRoot" });
      expect(root.attributes("open")).toBe("true");
    });

    it("re-emits child open state while uncontrolled", async () => {
      const wrapper = mountPopover();
      wrapper.findComponent({ name: "PopoverRoot" }).vm.$emit("update:open", true);
      await nextTick();
      expect(wrapper.emitted("update:open")).toEqual([[true]]);
      const root = wrapper.findComponent({ name: "PopoverRoot" });
      expect(root.attributes("open")).toBe("true");
    });

    it("stays pinned to the open prop while controlled", async () => {
      const wrapper = mountPopover({ open: false });
      wrapper.findComponent({ name: "PopoverRoot" }).vm.$emit("update:open", true);
      await nextTick();
      expect(wrapper.emitted("update:open")).toEqual([[true]]);
      const root = wrapper.findComponent({ name: "PopoverRoot" });
      expect(root.attributes("open")).toBe("false");
    });
  });

  describe("ctx", () => {
    it("exposes a writable open ref", async () => {
      const wrapper = mountPopover();
      wrapper.vm.ctx.open.value = true;
      await nextTick();
      expect(wrapper.emitted("update:open")).toEqual([[true]]);
      const root = wrapper.findComponent({ name: "PopoverRoot" });
      expect(root.attributes("open")).toBe("true");
    });
  });

  describe("passthrough", () => {
    it("pt.content merges onto the content part", () => {
      const wrapper = mountPopover({ pt: { content: { class: "custom" } } });
      const content = wrapper.findComponent({ name: "PopoverContent" });
      expect(content.classes()).toContain("custom");
      expect(content.attributes("side")).toBe("bottom");
    });

    it("user pt wins over the local recipe per key", () => {
      const wrapper = mountPopover({ pt: { content: { sideOffset: 4 } } });
      const content = wrapper.findComponent({ name: "PopoverContent" });
      expect(content.attributes("sideoffset")).toBe("4");
    });
  });

  describe("slots", () => {
    it("content slot renders inside the content part", () => {
      const wrapper = mountPopover({}, { content: "<p>Body</p>" });
      const content = wrapper.findComponent({ name: "PopoverContent" });
      expect(content.find("p").text()).toBe("Body");
    });

    it("trigger slot renders inside the trigger part", () => {
      const wrapper = mountPopover({}, { trigger: "<button>Click</button>" });
      expect(wrapper.findComponent({ name: "PopoverTrigger" }).text()).toContain("Click");
    });

    it("anchor slot overrides the anchor/trigger choice", () => {
      const wrapper = mountPopover({}, { anchor: "<div class=\"custom-anchor\"></div>" });
      expect(wrapper.find(".custom-anchor").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "PopoverTrigger" }).exists()).toBe(false);
    });
  });
});
