import { describe, it, expect } from "vitest";
import { mountAvatar } from "../fixtures";

describe("Avatar", () => {
  describe("static", () => {
    const wrapper = mountAvatar();

    it("renders root with f-avatar-root class", () => {
      expect(wrapper.find(".f-avatar-root").exists()).toBe(true);
    });

    it("renders AvatarImage", () => {
      expect(wrapper.findComponent({ name: "AvatarImage" }).exists()).toBe(true);
    });

    it("renders fallback text", () => {
      expect(wrapper.find(".f-avatar-fallback").text()).toContain("TU");
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountAvatar({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-avatar-root").classes()).toContain("custom");
    });
  });

  describe("slots", () => {
    it("image slot overrides default", () => {
      const wrapper = mountAvatar({}, { image: "<span class=\"custom-img\">IMG</span>" });
      expect(wrapper.find(".custom-img").exists()).toBe(true);
    });

    it("fallback slot overrides default", () => {
      const wrapper = mountAvatar({}, { fallback: "<span class=\"custom-fb\">FB</span>" });
      expect(wrapper.find(".custom-fb").exists()).toBe(true);
    });
  });
});
