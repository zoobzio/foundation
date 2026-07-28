import { describe, it, expect } from "vitest";
import { mountFab } from "#test/support/fixtures/components";

// Core tests stub the tier below: the composed common elements (Button, Anchor,
// Icon, Group) are replaced by name, so assertions target the stubs' rendered
// tags and bound attrs.
describe("Fab", () => {
  describe("static", () => {
    const wrapper = mountFab();

    it("renders a Button root by default", () => {
      expect(wrapper.findComponent({ name: "Button" }).exists()).toBe(true);
    });

    it("renders a single root node (no wrapper)", () => {
      expect(wrapper.element.tagName).toBe("BUTTON");
    });

    it("renders the icon part", () => {
      expect(
        wrapper.findAll("i").some((i) => i.attributes("alias") === "home"),
      ).toBe(true);
    });
  });

  describe("conditional", () => {
    it("renders the badge part when defined", () => {
      const wrapper = mountFab({ badge: "" });
      expect(wrapper.findComponent({ name: "Group" }).exists()).toBe(true);
    });

    it("renders the badge value", () => {
      const wrapper = mountFab({ badge: 3 });
      expect(wrapper.findComponent({ name: "Group" }).exists()).toBe(true);
      expect(wrapper.text()).toContain("3");
    });

    it("omits the badge part when undefined", () => {
      expect(mountFab().findComponent({ name: "Group" }).exists()).toBe(false);
    });

    it("omits the icon when icon is undefined", () => {
      expect(mountFab({ icon: undefined }).findAll("i")).toHaveLength(0);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto the root part", () => {
      const wrapper = mountFab({ pt: { root: { class: "custom" } } });
      expect(wrapper.findComponent({ name: "Button" }).classes()).toContain("custom");
    });

    it("forwards fallthrough attrs onto the root part", () => {
      const wrapper = mountFab({ id: "my-fab" });
      expect(wrapper.findComponent({ name: "Button" }).attributes("id")).toBe("my-fab");
    });

    it("forwards a click handler onto the root part", async () => {
      let clicked = false;
      const wrapper = mountFab({ onClick: () => { clicked = true; } });
      await wrapper.findComponent({ name: "Button" }).trigger("click");
      expect(clicked).toBe(true);
    });
  });

  describe("slots", () => {
    it("icon slot overrides the default icon", () => {
      const wrapper = mountFab({}, { icon: '<span class="custom-icon"></span>' });
      expect(wrapper.find(".custom-icon").exists()).toBe(true);
    });

    it("badge slot overrides the default badge", () => {
      const wrapper = mountFab(
        { badge: 1 },
        { badge: '<span class="custom-badge"></span>' },
      );
      expect(wrapper.find(".custom-badge").exists()).toBe(true);
    });
  });
});
