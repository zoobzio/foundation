import { describe, it, expect } from "vitest";
import { mountDeckWidget, mockDeck } from "#test/support/fixtures/data";

describe("DataDeckWidget", () => {
  describe("static", () => {
    const wrapper = mountDeckWidget();

    it("renders root with f-data-deck class", () => {
      expect(wrapper.find(".f-data-deck").exists()).toBe(true);
    });

    it("delegates to DataDeckToolbar", () => {
      expect(wrapper.findComponent({ name: "DataDeckToolbar" }).exists()).toBe(true);
    });

    it("delegates to DataDeckFeed", () => {
      expect(wrapper.findComponent({ name: "DataDeckFeed" }).exists()).toBe(true);
    });
  });

  describe("conditional", () => {
    it("always renders feed", () => {
      const deck = mockDeck();
      deck.loading.value = true;
      const wrapper = mountDeckWidget({ deck });
      expect(wrapper.findComponent({ name: "DataDeckFeed" }).exists()).toBe(true);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountDeckWidget({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-data-deck").classes()).toContain("custom");
    });
  });
});
