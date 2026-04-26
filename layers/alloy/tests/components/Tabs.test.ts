import { describe, it, expect } from "vitest";
import { mountTabs } from "../fixtures";
import { fakeOptionsWithIcons } from "../../../../packages/testing/data/options";

describe("Tabs", () => {
  describe("static", () => {
    const wrapper = mountTabs();

    it("renders root with f-tabs-root class", () => {
      expect(wrapper.find(".f-tabs-root").exists()).toBe(true);
    });

    it("renders list with f-tabs-list class", () => {
      expect(wrapper.find(".f-tabs-list").exists()).toBe(true);
    });

    it("renders trigger for each tab with label", () => {
      const triggers = wrapper.findAll(".f-tabs-trigger");
      expect(triggers).toHaveLength(3);
      expect(triggers[0].text()).toContain("Apple");
    });

    it("renders content for each tab", () => {
      expect(wrapper.findAll(".f-tabs-content")).toHaveLength(3);
    });
  });

  describe("conditional", () => {
    it("renders Icon when tab has icon", () => {
      const wrapper = mountTabs({ tabs: fakeOptionsWithIcons });
      expect(wrapper.findAll("i").some((i) => i.attributes("alias") === "home")).toBe(true);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountTabs({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-tabs-root").classes()).toContain("custom");
    });
  });

  describe("slots", () => {
    it("trigger slot overrides default", () => {
      const wrapper = mountTabs({}, { trigger: "<em>Custom Trigger</em>" });
      expect(wrapper.find(".f-tabs-trigger em").text()).toBe("Custom Trigger");
    });
  });
});
