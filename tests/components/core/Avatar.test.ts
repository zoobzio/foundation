import { describe, it, expect } from "vitest";
import { mountAvatar } from "#test/support/fixtures/components";

// Core tests stub the tier below: the behavioral element wrappers are replaced
// by their reka names, so assertions target the stubs' bound props/attrs.
describe("Avatar", () => {
  describe("static", () => {
    const wrapper = mountAvatar();

    it("renders the root part", () => {
      expect(wrapper.findComponent({ name: "AvatarRoot" }).exists()).toBe(true);
    });

    it("renders the image part with the src recipe", () => {
      const image = wrapper.findComponent({ name: "AvatarImage" });
      expect(image.exists()).toBe(true);
      expect(image.attributes("src")).toBe("https://example.com/avatar.png");
    });

    it("renders fallback text", () => {
      expect(wrapper.findComponent({ name: "AvatarFallback" }).text()).toContain("TU");
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto the root part", () => {
      const wrapper = mountAvatar({ pt: { root: { class: "custom" } } });
      expect(wrapper.findComponent({ name: "AvatarRoot" }).classes()).toContain("custom");
    });

    it("pt.image wins over the local src recipe", () => {
      const wrapper = mountAvatar({ pt: { image: { src: "https://override.test/a.png" } } });
      expect(wrapper.findComponent({ name: "AvatarImage" }).attributes("src")).toBe(
        "https://override.test/a.png",
      );
    });
  });

  describe("slots", () => {
    it("root slot overrides the whole root part", () => {
      const wrapper = mountAvatar({}, { root: "<div class=\"custom-root\"></div>" });
      expect(wrapper.find(".custom-root").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "AvatarRoot" }).exists()).toBe(false);
    });

    it("image slot overrides the default image part", () => {
      const wrapper = mountAvatar({}, { image: "<span class=\"custom-img\">IMG</span>" });
      expect(wrapper.find(".custom-img").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "AvatarImage" }).exists()).toBe(false);
    });

    it("fallback slot overrides the default fallback part", () => {
      const wrapper = mountAvatar({}, { fallback: "<span class=\"custom-fb\">FB</span>" });
      expect(wrapper.find(".custom-fb").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "AvatarFallback" }).exists()).toBe(false);
    });
  });
});
