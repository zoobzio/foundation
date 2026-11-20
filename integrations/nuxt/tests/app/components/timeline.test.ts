// The timeline wrapper: the layer's search and refresh, the sync menu in
// the visitor's locale, and the layer's text for the button that loads
// the next batch and for a timeline with no record.
import type { Commit } from "#test/data/timeline";

import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Timeline from "../../../app/components/timeline";
import { makeTimeline } from "#test/mount/timeline";

const mounted: { unmount: () => void }[] = [];

const mountTimeline = async (
  made: ReturnType<typeof makeTimeline>,
  slots: Record<string, string> = {},
) => {
  await made.service.init();
  const wrapper = mount(Timeline<Commit>, {
    props: { service: made.service },
    slots,
    attachTo: document.body,
  });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("timeline wrapper", () => {
  it("keeps a record's name as written, under its day", async () => {
    const wrapper = await mountTimeline(makeTimeline());
    expect(wrapper.get(".f-data-timeline-heading").text()).toBe("Mar 4, 2026");
    expect(
      wrapper.get('[data-key="e5"] .f-data-timeline-record-label').text(),
    ).toBe("Fix the build");
  });

  it("names the button that loads the next batch, and loads it", async () => {
    const made = makeTimeline();
    const wrapper = await mountTimeline(made);
    const more = wrapper.get("button.f-data-timeline-more");
    expect(more.text()).toBe("Load more");
    expect(more.attributes("aria-label")).toBe("Load more");
    await more.trigger("click");
    await flushPromises();
    expect(made.service.records).toHaveLength(5);
    expect(wrapper.find(".f-data-timeline-more").exists()).toBe(false);
  });

  it("dresses the search of a searchable timeline, and renders none otherwise", async () => {
    const plain = await mountTimeline(makeTimeline());
    expect(plain.find(".f-data-timeline-search").exists()).toBe(false);
    const wrapper = await mountTimeline(
      makeTimeline({ fields: { author: { label: "Author" } } }),
    );
    const search = wrapper.get(".f-data-timeline-search");
    expect(search.get("input").attributes("placeholder")).toBe("Search...");
    expect(search.find("kbd").exists()).toBe(true);
  });

  it("draws the refresh as an icon, named by its label", async () => {
    const wrapper = await mountTimeline(makeTimeline());
    const refresh = wrapper.get('button[aria-label="Refresh"]');
    expect(refresh.text()).toBe("");
    expect(refresh.get("svg[data-icon]").attributes("data-icon")).toBe(
      "refresh",
    );
  });

  it("draws the sync menu in the visitor's locale, and marks the interval it is on", async () => {
    const made = makeTimeline({}, { refresh: vi.fn() });
    const wrapper = await mountTimeline(made);
    made.service.sync?.setInterval(60_000);
    await wrapper
      .get('button[aria-label="Refresh"]')
      .trigger("click", { button: 0, ctrlKey: false });
    await flushPromises();
    const items = Array.from(
      document.body.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    );
    expect(items.map((el) => el.textContent?.trim())).toEqual([
      "Refresh now",
      "Off",
      "Every 10 seconds",
      "Every 30 seconds",
      "Every minute",
      "Every 5 minutes",
    ]);
    expect(
      items.map((el) =>
        el.querySelector("svg[data-icon]")?.getAttribute("data-icon"),
      ),
    ).toEqual([undefined, undefined, undefined, undefined, "check", undefined]);
  });

  it("says so when there is no record", async () => {
    const wrapper = await mountTimeline(makeTimeline({}, {}, []));
    expect(wrapper.get(".f-data-timeline-empty").text()).toBe("Nothing yet");
  });

  it("lets a consumer's card win", async () => {
    const wrapper = await mountTimeline(makeTimeline(), {
      record: `<template #record="{ item }"><b class="card">{{ item.record.sha }}</b></template>`,
    });
    expect(wrapper.findAll(".card").map((card) => card.text())).toEqual([
      "e5",
      "d4",
      "c3",
    ]);
  });
});
