import { describe, it, expect } from "vitest";
import { mountCalendar } from "../fixtures";

describe("Calendar", () => {
  describe("static", () => {
    const wrapper = mountCalendar();

    it("renders root with f-calendar class", () => {
      expect(wrapper.find(".f-calendar").exists()).toBe(true);
    });

    it("defaults numberOfMonths to 1", () => {
      expect(wrapper.find(".f-calendar").attributes("numberofmonths")).toBe("1");
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountCalendar({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-calendar").classes()).toContain("custom");
    });
  });
});
