import { describe, it, expect } from "vitest";
import { mountHero } from "#test/support/fixtures/components";

// Core tests stub the tier below: the composed common elements are replaced by
// name, so assertions target the stubs' bound props/attrs and rendered classes.
describe("Hero", () => {
  describe("static", () => {
    const wrapper = mountHero();

    it("renders the root part", () => {
      expect(wrapper.findComponent({ name: "Section" }).exists()).toBe(true);
    });

    it("renders the content part", () => {
      expect(wrapper.findComponent({ name: "Group" }).exists()).toBe(true);
    });

    it("renders the tagline text", () => {
      expect(wrapper.text()).toContain("Test Tagline");
    });
  });

  describe("conditional", () => {
    it("renders the highlight when taglineHighlight is provided", () => {
      const wrapper = mountHero({ taglineHighlight: "Amazing" });
      expect(wrapper.find("em").text()).toContain("Amazing");
    });

    it("omits the highlight without taglineHighlight", () => {
      expect(mountHero().find("em").exists()).toBe(false);
    });

    it("renders the description when provided", () => {
      const wrapper = mountHero({ description: "A design system" });
      expect(wrapper.find("p").text()).toContain("A design system");
    });

    it("omits the description without a description prop", () => {
      expect(mountHero().find("p").exists()).toBe(false);
    });

    it("renders the button when an action is provided", () => {
      const wrapper = mountHero({ action: { label: "Go", to: "/start" } });
      expect(wrapper.find("button").exists()).toBe(true);
    });

    it("omits the button without an action", () => {
      expect(mountHero().find("button").exists()).toBe(false);
    });

    it("renders the showcase part when the showcase slot is provided", () => {
      const wrapper = mountHero({}, { showcase: "<div class=\"demo\">Demo</div>" });
      expect(wrapper.findAllComponents({ name: "Group" })).toHaveLength(2);
      expect(wrapper.find(".demo").exists()).toBe(true);
    });

    it("omits the showcase part without the showcase slot", () => {
      expect(mountHero().findAllComponents({ name: "Group" })).toHaveLength(1);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto the root part", () => {
      const wrapper = mountHero({ pt: { root: { class: "custom" } } });
      expect(wrapper.findComponent({ name: "Section" }).classes()).toContain("custom");
    });

    it("pt.content merges onto the content part", () => {
      const wrapper = mountHero({ pt: { content: { class: "custom" } } });
      expect(wrapper.findComponent({ name: "Group" }).classes()).toContain("custom");
    });

    it("pt.description merges onto the description part", () => {
      const wrapper = mountHero({
        description: "A design system",
        pt: { description: { class: "custom" } },
      });
      expect(wrapper.find("p").classes()).toContain("custom");
    });
  });

  describe("slots", () => {
    it("content slot overrides the whole content part", () => {
      const wrapper = mountHero({}, { content: "<div class=\"custom-content\"></div>" });
      expect(wrapper.find(".custom-content").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "Group" }).exists()).toBe(false);
    });

    it("tagline slot overrides the default tagline", () => {
      const wrapper = mountHero({}, { tagline: "<h2 class=\"custom-tagline\">Hi</h2>" });
      expect(wrapper.find(".custom-tagline").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "H1" }).exists()).toBe(false);
    });

    it("description slot overrides the default description", () => {
      const wrapper = mountHero({}, { description: "<p class=\"custom-desc\">Hi</p>" });
      expect(wrapper.find(".custom-desc").exists()).toBe(true);
    });

    it("button slot overrides the default button", () => {
      const wrapper = mountHero({}, { button: "<button class=\"custom-btn\"></button>" });
      expect(wrapper.find(".custom-btn").exists()).toBe(true);
    });
  });
});
