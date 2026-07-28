import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountTooltip } from "#test/support/fixtures/components";

// Core tests stub the tier below: the behavioral element wrappers are replaced
// by name, so assertions target the stubs' bound props/attrs.
describe("Tooltip", () => {
  describe("static", () => {
    const wrapper = mountTooltip({}, { default: "<button>Hover me</button>" });

    it("renders the root part with open=false by default", () => {
      const root = wrapper.findComponent({ name: "TooltipRoot" });
      expect(root.exists()).toBe(true);
      expect(root.attributes("open")).toBe("false");
    });

    it("wires the trigger as-child through the recipe", () => {
      const trigger = wrapper.findComponent({ name: "TooltipTrigger" });
      expect(trigger.attributes("aschild")).toBe("true");
    });

    it("renders default slot inside the trigger", () => {
      expect(wrapper.findComponent({ name: "TooltipTrigger" }).text()).toContain("Hover me");
    });

    it("passes positioning defaults through the content recipe", () => {
      const content = wrapper.findComponent({ name: "TooltipContent" });
      expect(content.attributes("side")).toBe("bottom");
      expect(content.attributes("align")).toBe("center");
      expect(content.attributes("sideoffset")).toBe("10");
    });

    it("renders content text", () => {
      expect(wrapper.findComponent({ name: "TooltipContent" }).text()).toContain("Tooltip text");
    });

    it("passes delayDuration through the root recipe", () => {
      const root = wrapper.findComponent({ name: "TooltipRoot" });
      expect(root.attributes("delayduration")).toBe("0");
    });
  });

  describe("models", () => {
    it("supports v-model:open as a controlled prop", () => {
      const wrapper = mountTooltip({ open: true });
      const root = wrapper.findComponent({ name: "TooltipRoot" });
      expect(root.attributes("open")).toBe("true");
    });

    it("re-emits child open state while uncontrolled", async () => {
      const wrapper = mountTooltip();
      wrapper.findComponent({ name: "TooltipRoot" }).vm.$emit("update:open", true);
      await nextTick();
      expect(wrapper.emitted("update:open")).toEqual([[true]]);
      const root = wrapper.findComponent({ name: "TooltipRoot" });
      expect(root.attributes("open")).toBe("true");
    });

    it("stays pinned to the open prop while controlled", async () => {
      const wrapper = mountTooltip({ open: false });
      wrapper.findComponent({ name: "TooltipRoot" }).vm.$emit("update:open", true);
      await nextTick();
      expect(wrapper.emitted("update:open")).toEqual([[true]]);
      const root = wrapper.findComponent({ name: "TooltipRoot" });
      expect(root.attributes("open")).toBe("false");
    });
  });

  describe("ctx", () => {
    it("exposes a writable open ref", async () => {
      const wrapper = mountTooltip();
      wrapper.vm.ctx.open.value = true;
      await nextTick();
      expect(wrapper.emitted("update:open")).toEqual([[true]]);
      const root = wrapper.findComponent({ name: "TooltipRoot" });
      expect(root.attributes("open")).toBe("true");
    });
  });

  describe("passthrough", () => {
    it("pt.content merges onto the content part", () => {
      const wrapper = mountTooltip({ pt: { content: { class: "custom" } } });
      const content = wrapper.findComponent({ name: "TooltipContent" });
      expect(content.classes()).toContain("custom");
      expect(content.attributes("side")).toBe("bottom");
    });

    it("user pt wins over the local recipe per key", () => {
      const wrapper = mountTooltip({ pt: { content: { sideOffset: 4 } } });
      const content = wrapper.findComponent({ name: "TooltipContent" });
      expect(content.attributes("sideoffset")).toBe("4");
    });
  });

  describe("slots", () => {
    it("trigger slot overrides default", () => {
      const wrapper = mountTooltip({}, { trigger: "<div class=\"custom-trigger\">Anchor</div>" });
      expect(wrapper.find(".custom-trigger").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "TooltipTrigger" }).exists()).toBe(false);
    });

    it("content slot overrides default", () => {
      const wrapper = mountTooltip({}, { content: "<em>Custom</em>" });
      expect(wrapper.find("em").text()).toBe("Custom");
      expect(wrapper.findComponent({ name: "TooltipContent" }).exists()).toBe(false);
    });
  });
});
