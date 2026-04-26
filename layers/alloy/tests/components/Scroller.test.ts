import { describe, it, expect } from "vitest";
import { mountScroller } from "../fixtures";

describe("Scroller", () => {
  describe("static", () => {
    const wrapper = mountScroller();

    it("renders root with f-scroller-root class", () => {
      expect(wrapper.find(".f-scroller-root").exists()).toBe(true);
    });

    it("shows vertical scrollbar by default", () => {
      const scrollbars = wrapper.findAllComponents({ name: "ScrollAreaScrollbar" });
      expect(scrollbars).toHaveLength(1);
      expect(scrollbars[0].attributes("orientation")).toBe("vertical");
    });
  });

  describe("conditional", () => {
    it("shows horizontal scrollbar when orientation='horizontal'", () => {
      const wrapper = mountScroller({ orientation: "horizontal" });
      const scrollbars = wrapper.findAllComponents({ name: "ScrollAreaScrollbar" });
      expect(scrollbars).toHaveLength(1);
      expect(scrollbars[0].attributes("orientation")).toBe("horizontal");
    });

    it("shows both scrollbars and corner when orientation='both'", () => {
      const wrapper = mountScroller({ orientation: "both" });
      const scrollbars = wrapper.findAllComponents({ name: "ScrollAreaScrollbar" });
      expect(scrollbars).toHaveLength(2);
      expect(wrapper.findComponent({ name: "ScrollAreaCorner" }).exists()).toBe(true);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountScroller({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-scroller-root").classes()).toContain("custom");
    });
  });
});
