import { describe, it, expect } from "vitest";
import { mountHero } from "../fixtures";

describe("Hero", () => {
  describe("static", () => {
    const wrapper = mountHero();

    it("renders root with f-hero class", () => {
      expect(wrapper.find(".f-hero").exists()).toBe(true);
    });

    it("renders tagline text", () => {
      expect(wrapper.text()).toContain("Test Tagline");
    });

    it("renders content group with f-hero-content class", () => {
      expect(wrapper.find(".f-hero-content").exists()).toBe(true);
    });
  });

  describe("conditional", () => {
    it("renders Em when taglineHighlight provided", () => {
      const wrapper = mountHero({ taglineHighlight: "Amazing" });
      expect(wrapper.find("em").text()).toContain("Amazing");
    });

    it("does not render Em without taglineHighlight", () => {
      const wrapper = mountHero();
      expect(wrapper.find("em").exists()).toBe(false);
    });

    it("renders P when description provided", () => {
      const wrapper = mountHero({ description: "A design system" });
      expect(wrapper.find("p").text()).toContain("A design system");
    });

    it("does not render P without description", () => {
      const wrapper = mountHero();
      expect(wrapper.find("p").exists()).toBe(false);
    });

    it("renders Button when action provided", () => {
      const wrapper = mountHero({ action: { label: "Go", to: "/start" } });
      expect(wrapper.find("button").exists()).toBe(true);
    });

    it("does not render Button without action", () => {
      const wrapper = mountHero();
      expect(wrapper.find("button").exists()).toBe(false);
    });

    it("renders showcase group when showcase slot provided", () => {
      const wrapper = mountHero({}, { showcase: "<div class=\"demo\">Demo</div>" });
      expect(wrapper.find(".f-hero-showcase").exists()).toBe(true);
      expect(wrapper.find(".demo").exists()).toBe(true);
    });

    it("does not render showcase group without slot", () => {
      const wrapper = mountHero();
      expect(wrapper.find(".f-hero-showcase").exists()).toBe(false);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountHero({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-hero").classes()).toContain("custom");
    });
  });
});
