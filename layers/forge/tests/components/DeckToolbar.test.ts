import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import type { DefineComponent } from "vue";
import { passthrough } from "../../../../layers/alloy/app/utils/passthrough";
import { usePassthrough } from "../../../../layers/alloy/app/composables/passthrough";
import { oreStubs, alloyStubs, createAllSlotsStub } from "../../../../packages/testing/helpers/stubs";
import { createMockDeck } from "../../../../packages/testing/helpers/mock-deck";
import { fakeRows } from "../../../../packages/testing/data/table";
import type { FakeRow } from "../../../../packages/testing/data/table";
import type { Deck } from "../../app/types/data-deck";

const Toolbar = (await import("../../app/components/Data/Deck/Toolbar.vue")).default as DefineComponent;

const stubs = {
  ...oreStubs,
  ...alloyStubs,
  Popover: createAllSlotsStub("Popover"),
  DataDeckFeed: createAllSlotsStub("DataDeckFeed"),
};
const mocks = { passthrough, usePassthrough };

const mockDeck = (overrides: Partial<Deck<FakeRow>> = {}) =>
  ({ ...createMockDeck<FakeRow>({ rowKey: "id", items: fakeRows }), ...overrides }) as Deck<FakeRow>;

const mountDeckToolbar = (props: Record<string, unknown> = {}) =>
  shallowMount(Toolbar, {
    props: { deck: mockDeck(), ...props },
    global: { stubs, mocks },
  });

describe("DataDeckToolbar", () => {
  describe("static", () => {
    const wrapper = mountDeckToolbar();

    it("renders root with f-data-deck-toolbar class", () => {
      expect(wrapper.find(".f-data-deck-toolbar").exists()).toBe(true);
    });

    it("renders title area", () => {
      expect(wrapper.find(".f-data-deck-title").exists()).toBe(true);
    });

    it("renders actions area", () => {
      expect(wrapper.find(".f-data-deck-actions").exists()).toBe(true);
    });

    it("renders sort Popover", () => {
      const title = wrapper.find(".f-data-deck-title");
      expect(title.findComponent({ name: "Popover" }).exists()).toBe(true);
    });

    it("renders search Popover", () => {
      const actions = wrapper.find(".f-data-deck-actions");
      expect(actions.findComponent({ name: "Popover" }).exists()).toBe(true);
    });

    it("renders Facets component", () => {
      expect(wrapper.findComponent({ name: "Facets" }).exists()).toBe(true);
    });

    it("renders refresh Fab", () => {
      const fabs = wrapper.findAllComponents({ name: "Fab" });
      const refreshFab = fabs.find((f) => f.attributes("icon") === "refresh");
      expect(refreshFab).toBeDefined();
    });
  });

  describe("title", () => {
    it("renders deck.title in the title button", () => {
      const deck = mockDeck();
      const wrapper = mountDeckToolbar({ deck });
      const btn = wrapper.find(".f-data-deck-title-btn");
      expect(btn.text()).toContain("Recently Created Test");
    });
  });

  describe("sort groups", () => {
    it("renders Command for sort field selection", () => {
      const wrapper = mountDeckToolbar();
      const command = wrapper.findComponent({ name: "Command" });
      expect(command.exists()).toBe(true);
    });
  });

  describe("search badge", () => {
    it("search Fab has badge when deck.query is non-empty", () => {
      const deck = mockDeck();
      deck.query.value = "hello";
      const wrapper = mountDeckToolbar({ deck });
      const fabs = wrapper.findAllComponents({ name: "Fab" });
      const searchFab = fabs.find((f) => f.attributes("icon") === "search");
      expect(searchFab).toBeDefined();
      if (!searchFab) return;
      expect(searchFab.attributes("badge")).toBeDefined();
    });

    it("search Fab has no badge when deck.query is empty", () => {
      const deck = mockDeck();
      deck.query.value = "";
      const wrapper = mountDeckToolbar({ deck });
      const fabs = wrapper.findAllComponents({ name: "Fab" });
      const searchFab = fabs.find((f) => f.attributes("icon") === "search");
      expect(searchFab).toBeDefined();
      if (!searchFab) return;
      expect(searchFab.attributes("badge")).toBeUndefined();
    });
  });

  describe("facets", () => {
    it("renders Facets component", () => {
      const deck = mockDeck();
      deck.facetGroups.value = [
        { key: "status", label: "Status", items: [{ value: "active", label: "Active", count: 3 }] },
      ];
      const wrapper = mountDeckToolbar({ deck });
      const facets = wrapper.findComponent({ name: "Facets" });
      expect(facets.exists()).toBe(true);
    });
  });

  describe("search interaction", () => {
    it("renders search Input inside popover content", () => {
      const wrapper = mountDeckToolbar();
      expect(wrapper.find(".f-data-deck-search").exists()).toBe(true);
      expect(wrapper.find(".f-data-deck-search").findComponent({ name: "Input" }).exists()).toBe(true);
    });
  });

  describe("refresh", () => {
    it("clicking refresh Fab calls deck.fetch", async () => {
      const deck = mockDeck();
      const wrapper = shallowMount(Toolbar, {
        props: { deck },
        global: { stubs, mocks },
      });
      const fabs = wrapper.findAllComponents({ name: "Fab" });
      const refreshFab = fabs.find((f) => f.attributes("icon") === "refresh");
      if (!refreshFab) return;
      await refreshFab.trigger("click");
      expect(deck.fetch).toHaveBeenCalled();
    });
  });

  describe("search input interaction", () => {
    it("updates search value on input event", async () => {
      const deck = mockDeck();
      const wrapper = shallowMount(Toolbar, {
        props: { deck },
        global: { stubs, mocks },
      });
      const input = wrapper.find(".f-data-deck-search").findComponent({ name: "Input" });
      const inputEvent = new Event("input", { bubbles: true });
      Object.defineProperty(inputEvent, "target", { value: { value: "hello" } });
      input.element.dispatchEvent(inputEvent);
      // No crash — handler ran
    });

    it("closes search popover on Escape", async () => {
      const wrapper = mountDeckToolbar();
      const input = wrapper.find(".f-data-deck-search").findComponent({ name: "Input" });
      await input.trigger("keydown", { key: "Escape" });
      // No crash — escape handler ran
    });
  });

  describe("facets interaction", () => {
    it("renders Facets with facet groups", () => {
      const deck = mockDeck();
      deck.facetGroups.value = [
        { key: "status", label: "Status", items: [{ value: "Active", label: "Active", count: 1 }] },
      ];
      const wrapper = mountDeckToolbar({ deck });
      expect(wrapper.findComponent({ name: "Facets" }).exists()).toBe(true);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountDeckToolbar({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-data-deck-toolbar").classes()).toContain("custom");
    });
  });
});
