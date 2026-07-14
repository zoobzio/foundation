import { describe, it, expect } from "vitest";
import { mountCalendar } from "#test/support/fixtures/components";

describe("Calendar", () => {
  describe("static", () => {
    const wrapper = mountCalendar();

    it("renders root with f-calendar class", () => {
      expect(wrapper.find(".f-calendar").exists()).toBe(true);
    });

    it("defaults numberOfMonths to 1", () => {
      expect(wrapper.find(".f-calendar").attributes("numberofmonths")).toBe("1");
    });

    it("renders navigation buttons", () => {
      expect(wrapper.find(".f-calendar-nav").exists()).toBe(true);
    });

    it("renders grid", () => {
      expect(wrapper.find(".f-calendar-grid").exists()).toBe(true);
    });

    it("renders head cells for weekDays", () => {
      const headCells = wrapper.findAll(".f-calendar-head-cell");
      expect(headCells).toHaveLength(7);
    });

    it("renders grid rows", () => {
      const rows = wrapper.findAll(".f-calendar-row");
      // 1 head row + 1 body row
      expect(rows.length).toBeGreaterThanOrEqual(2);
    });

    it("renders cell triggers", () => {
      const cells = wrapper.findAll(".f-calendar-cell");
      expect(cells).toHaveLength(7);
    });

    it("renders cell trigger elements", () => {
      const triggers = wrapper.findAll(".f-calendar-cell-trigger");
      expect(triggers).toHaveLength(7);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountCalendar({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-calendar").classes()).toContain("custom");
    });
  });
});
