import { describe, it, expect } from "vitest";
import { mountDeckFeed, mockDeck } from "../fixtures";
import { fakeRows } from "../data/table";

describe("DataDeckFeed", () => {
  describe("static", () => {
    const wrapper = mountDeckFeed();

    it("renders root with f-data-deck-feed class", () => {
      expect(wrapper.find(".f-data-deck-feed").exists()).toBe(true);
    });

    it("renders sentinel element", () => {
      expect(wrapper.find(".f-data-deck-sentinel").exists()).toBe(true);
    });
  });

  describe("conditional", () => {
    it("shows empty state when items is empty", () => {
      const deck = mockDeck();
      deck.items.value = [];
      const wrapper = mountDeckFeed({ deck });
      expect(wrapper.find(".f-data-deck-empty").exists()).toBe(true);
      expect(wrapper.text()).toContain("No items");
    });

    it("does not show empty state when items exist", () => {
      const wrapper = mountDeckFeed();
      expect(wrapper.find(".f-data-deck-empty").exists()).toBe(false);
    });

    it("renders a card per item", () => {
      const wrapper = mountDeckFeed();
      const cards = wrapper.findAll(".f-data-deck-card");
      expect(cards).toHaveLength(fakeRows.length);
    });

    it("shows loadingMore slot when deck.loadingMore is true", () => {
      const deck = mockDeck();
      deck.loadingMore.value = true;
      const wrapper = mountDeckFeed(
        { deck },
        { loadingMore: "<span class=\"loading-more-indicator\">Loading...</span>" },
      );
      expect(wrapper.find(".loading-more-indicator").exists()).toBe(true);
    });

    it("does not show loadingMore slot when deck.loadingMore is false", () => {
      const wrapper = mountDeckFeed(
        {},
        { loadingMore: "<span class=\"loading-more-indicator\">Loading...</span>" },
      );
      expect(wrapper.find(".loading-more-indicator").exists()).toBe(false);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountDeckFeed({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-data-deck-feed").classes()).toContain("custom");
    });
  });
});
