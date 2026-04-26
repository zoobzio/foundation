import { describe, it, expect } from "vitest";
import { mountRangeCalendar } from "../fixtures";

describe("RangeCalendar", () => {
  describe("static", () => {
    const wrapper = mountRangeCalendar();

    it("renders root with f-calendar and f-calendar--range classes", () => {
      const root = wrapper.find(".f-calendar");
      expect(root.exists()).toBe(true);
      expect(root.classes()).toContain("f-calendar--range");
    });

    it("defaults numberOfMonths to 1", () => {
      expect(wrapper.find(".f-calendar").attributes("numberofmonths")).toBe("1");
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountRangeCalendar({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-calendar").classes()).toContain("custom");
    });
  });
});
