// The deck widget's icon relays: the toolbar's icon slots are reachable from
// the widget, and the pending fab takes its own. The service is built
// through the real factory; the feed is stubbed — card rendering is not
// under test here.
import { describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import type { FunctionalComponent } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import { defineEntity } from "../../../../../app/definitions/entity";
import { useDeck } from "../../../../../app/factories/deck";
import Widget from "../../../../../app/components/data/deck/widget.vue";
import type {
  DeckWidgetEmits,
  DeckWidgetProps,
} from "../../../../../app/types/data/deck/widget";
import type { Actions } from "../../../../../app/types/data/deck";
import { createStub } from "#test/stubs/factories";
import { fakeRows } from "#test/data/table";
import type { FakeRow } from "#test/data/table";

// Generic SFCs don't instantiate through h()'s types — assigning to a
// concretely-typed FunctionalComponent instantiates T for the harness.
const DeckWidget: FunctionalComponent<
  DeckWidgetProps<FakeRow>,
  DeckWidgetEmits
> = Widget;

const rows = defineEntity<FakeRow>();

const definition = rows.defineDeck({
  topic: "contacts",
  rowKey: "id",
  dateFields: [{ key: "created", label: "Created" }],
});

const mountWidget = async (slots: Record<string, string> = {}) => {
  const wrapper = mount(
    defineComponent({
      setup(_, { slots: forwarded }) {
        const widget = useDeck("d1", definition, {
          fetch: vi.fn<Actions<FakeRow>["fetch"]>(async () => ({
            data: fakeRows,
            hasMore: false,
          })),
        });
        return () => h(DeckWidget, { service: widget.service }, forwarded);
      },
    }),
    { slots, global: { stubs: { Feed: createStub("Feed") } } },
  );
  await flushPromises();
  return wrapper;
};

describe("data deck widget", () => {
  it("labels the toolbar fabs and renders no sort glyph by default", async () => {
    const wrapper = await mountWidget();
    expect(wrapper.get('button[aria-label="Search"]').text()).toBe("Search");
    expect(wrapper.get('button[aria-label="Refresh"]').text()).toBe("Refresh");
    expect(
      wrapper.get(".f-data-deck-title-btn").element.childElementCount,
    ).toBe(0);
  });

  it("relays the toolbar icon slots through the widget", async () => {
    const wrapper = await mountWidget({
      sortIcon: `<template #sortIcon="s"><i>{{ s.deck.id }}</i></template>`,
      searchIcon: `<template #searchIcon><b>search</b></template>`,
      refreshIcon: `<template #refreshIcon><b>refresh</b></template>`,
      facetsIcon: `<template #facetsIcon><b>facets</b></template>`,
    });
    expect(wrapper.get(".f-data-deck-title-btn i").text()).toBe("d1");
    const search = wrapper.get('button[aria-label="Search"]');
    expect(search.get("b").text()).toBe("search");
    expect(search.find(".f-span").exists()).toBe(false);
    expect(wrapper.get('button[aria-label="Refresh"] b').text()).toBe(
      "refresh",
    );
    expect(wrapper.get('button[aria-label="Filters"] b').text()).toBe("facets");
  });
});
