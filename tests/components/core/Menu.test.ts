import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountMenu } from "#test/support/fixtures/components";
import { fakeMenuGroups } from "#test/support/data/menu";

// Core tests stub the tier below: the behavioral element wrappers are replaced
// by name, so assertions target the stubs' bound props/attrs.
describe("Menu", () => {
  describe("static", () => {
    const wrapper = mountMenu();

    it("renders the root part with open=false by default", () => {
      const root = wrapper.findComponent({ name: "DropdownMenuRoot" });
      expect(root.exists()).toBe(true);
      expect(root.attributes("open")).toBe("false");
    });

    it("wires the trigger as-child through the recipe", () => {
      const trigger = wrapper.findComponent({ name: "DropdownMenuTrigger" });
      expect(trigger.attributes("aschild")).toBe("true");
    });

    it("passes positioning defaults through the content recipe", () => {
      const content = wrapper.findComponent({ name: "DropdownMenuContent" });
      expect(content.attributes("side")).toBe("bottom");
      expect(content.attributes("align")).toBe("center");
      expect(content.attributes("sideoffset")).toBe("10");
      expect(content.attributes("alignoffset")).toBe("0");
    });

    it("renders an item per menu item through the iter recipe", () => {
      expect(wrapper.findAllComponents({ name: "DropdownMenuItem" })).toHaveLength(4);
    });

    it("renders a separator between groups", () => {
      expect(wrapper.findAllComponents({ name: "DropdownMenuSeparator" })).toHaveLength(1);
    });

    it("renders group label when present", () => {
      const labels = wrapper.findAllComponents({ name: "DropdownMenuLabel" });
      expect(labels).toHaveLength(1);
      expect(wrapper.text()).toContain("Navigate");
    });
  });

  describe("conditional", () => {
    it("renders an icon through the iter recipe when the item has one", () => {
      const wrapper = mountMenu();
      expect(wrapper.findAll("i").some((i) => i.attributes("alias") === "edit")).toBe(true);
    });

    it("does not render an icon when the item has none", () => {
      const wrapper = mountMenu({
        groups: [{ key: "plain", items: [{ label: "No Icon" }] }],
      });
      expect(wrapper.findAll("i")).toHaveLength(0);
    });
  });

  describe("models", () => {
    it("supports v-model:open as a controlled prop", () => {
      const wrapper = mountMenu({ open: true });
      const root = wrapper.findComponent({ name: "DropdownMenuRoot" });
      expect(root.attributes("open")).toBe("true");
    });

    it("re-emits child open state while uncontrolled", async () => {
      const wrapper = mountMenu();
      wrapper.findComponent({ name: "DropdownMenuRoot" }).vm.$emit("update:open", true);
      await nextTick();
      expect(wrapper.emitted("update:open")).toEqual([[true]]);
      const root = wrapper.findComponent({ name: "DropdownMenuRoot" });
      expect(root.attributes("open")).toBe("true");
    });

    it("stays pinned to the open prop while controlled", async () => {
      const wrapper = mountMenu({ open: false });
      wrapper.findComponent({ name: "DropdownMenuRoot" }).vm.$emit("update:open", true);
      await nextTick();
      expect(wrapper.emitted("update:open")).toEqual([[true]]);
      const root = wrapper.findComponent({ name: "DropdownMenuRoot" });
      expect(root.attributes("open")).toBe("false");
    });
  });

  describe("ctx", () => {
    it("exposes a writable open ref", async () => {
      const wrapper = mountMenu();
      wrapper.vm.ctx.open.value = true;
      await nextTick();
      expect(wrapper.emitted("update:open")).toEqual([[true]]);
      const root = wrapper.findComponent({ name: "DropdownMenuRoot" });
      expect(root.attributes("open")).toBe("true");
    });
  });

  describe("interaction", () => {
    it("emits select in the component vocabulary when an item selects", async () => {
      const wrapper = mountMenu();
      wrapper.findAllComponents({ name: "DropdownMenuItem" })[0].vm.$emit("select");
      await nextTick();
      expect(wrapper.emitted("select")).toEqual([[fakeMenuGroups[0].items[0]]]);
    });
  });

  describe("passthrough", () => {
    it("pt.content merges onto the content part", () => {
      const wrapper = mountMenu({ pt: { content: { class: "custom" } } });
      const content = wrapper.findComponent({ name: "DropdownMenuContent" });
      expect(content.classes()).toContain("custom");
      expect(content.attributes("side")).toBe("bottom");
    });

    it("a user iter callback replaces the item recipe wholesale", () => {
      const wrapper = mountMenu({
        pt: { item: () => ({ textValue: "override" }) },
      });
      const items = wrapper.findAllComponents({ name: "DropdownMenuItem" });
      expect(items.map((i) => i.attributes("textvalue"))).toEqual([
        "override",
        "override",
        "override",
        "override",
      ]);
    });
  });

  describe("slots", () => {
    it("trigger slot overrides default", () => {
      const wrapper = mountMenu({}, { trigger: "<div class=\"custom-trigger\"></div>" });
      expect(wrapper.find(".custom-trigger").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "DropdownMenuTrigger" }).exists()).toBe(false);
    });

    it("content slot overrides the group composition", () => {
      const wrapper = mountMenu({}, { content: "<p>Custom body</p>" });
      const content = wrapper.findComponent({ name: "DropdownMenuContent" });
      expect(content.find("p").text()).toBe("Custom body");
      expect(wrapper.findComponent({ name: "DropdownMenuItem" }).exists()).toBe(false);
    });

    it("groupLabel slot overrides default", () => {
      const wrapper = mountMenu({}, { groupLabel: "<b class=\"custom-label\"></b>" });
      expect(wrapper.findAll(".custom-label")).toHaveLength(1);
    });

    it("item slot overrides the item part", () => {
      const wrapper = mountMenu({}, { item: "<div class=\"custom-item\"></div>" });
      expect(wrapper.findAll(".custom-item")).toHaveLength(4);
      expect(wrapper.findComponent({ name: "DropdownMenuItem" }).exists()).toBe(false);
    });
  });
});
