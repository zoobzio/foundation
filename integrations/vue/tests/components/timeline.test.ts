import type { TimelineProps } from "../../src/types/components/timeline";
import type { FetchResult } from "@zoobzio/timeline";
import type { Commit } from "#test/data/timeline";

import { afterEach, describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { nextTick } from "vue";
import Timeline from "../../src/components/timeline.vue";
import { makeTimeline } from "#test/mount/timeline";

const mounted: { unmount: () => void }[] = [];

const mountTimeline = async (
  props: TimelineProps<Commit>,
  slots: Record<string, string> = {},
) => {
  await props.service.init();
  const wrapper = mount(Timeline<Commit>, {
    props,
    slots,
    attachTo: document.body,
  });
  mounted.push(wrapper);
  return wrapper;
};

/** Text with each run of whitespace, the narrow ones `Intl` writes included, as one space. */
const plain = (text: string) => text.replace(/\s+/g, " ");

/** Each group of a timeline: its heading over the keys of its cards. */
const read = (wrapper: Awaited<ReturnType<typeof mountTimeline>>) =>
  wrapper
    .findAll(".f-data-timeline-group")
    .map((group) => [
      group.find(".f-data-timeline-heading").exists()
        ? group.get(".f-data-timeline-heading").text()
        : "",
      group
        .findAll(".f-data-timeline-record")
        .map((record) => record.attributes("data-key")),
    ]);

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("timeline", () => {
  it("lists the records as cards under the day each falls on", async () => {
    const { service } = makeTimeline();
    const wrapper = await mountTimeline({ service });
    expect(wrapper.get(".f-data-timeline").attributes("data-order")).toBe(
      "desc",
    );
    expect(read(wrapper)).toEqual([
      ["Mar 4, 2026", ["e5", "d4"]],
      ["Mar 3, 2026", ["c3"]],
    ]);
    const groups = wrapper.findAll(".f-data-timeline-group");
    expect(groups[0]?.attributes("data-group")).toBe("2026-03-04");
    expect(groups[0]?.attributes("data-today")).toBe("true");
    expect(groups[1]?.attributes("data-today")).toBe(undefined);
    expect(
      groups[0]?.get(".f-data-timeline-heading time").attributes("datetime"),
    ).toBe("2026-03-04");
  });

  it("reads a card's name from the label property, and its time in the zone", async () => {
    const { service } = makeTimeline();
    const wrapper = await mountTimeline({ service });
    const card = wrapper.get('[data-key="d4"]');
    expect(card.element.tagName).toBe("ARTICLE");
    expect(card.get(".f-data-timeline-record-label").text()).toBe(
      "Add a loader",
    );
    const time = card.get(".f-data-timeline-record-time");
    expect(plain(time.text())).toBe("9:00 AM");
    expect(time.attributes("datetime")).toBe("2026-03-04T09:00:00.000Z");
  });

  it("groups and reads in the timeline's zone and locale", async () => {
    const { service } = makeTimeline({
      timeZone: "Asia/Tokyo",
      locale: "nl-NL",
    });
    const wrapper = await mountTimeline({ service });
    expect(read(wrapper)).toEqual([
      ["5 mrt 2026", ["e5"]],
      ["4 mrt 2026", ["d4", "c3"]],
    ]);
    expect(
      wrapper.get('[data-key="c3"] .f-data-timeline-record-time').text(),
    ).toBe("08:30");
  });

  it("groups by the month or the year, with the date on each card", async () => {
    const { service } = makeTimeline({ group: "month", limit: 5 });
    const wrapper = await mountTimeline({ service });
    expect(read(wrapper)).toEqual([
      ["March 2026", ["e5", "d4", "c3", "b2"]],
      ["February 2026", ["a1"]],
    ]);
    expect(
      plain(wrapper.get('[data-key="a1"] .f-data-timeline-record-time').text()),
    ).toBe("Feb 27, 2026, 12:00 PM");
    expect(wrapper.get(".f-data-timeline-group").attributes("data-today")).toBe(
      "true",
    );
    const yearly = makeTimeline({ group: "year", limit: 5 });
    expect(read(await mountTimeline({ service: yearly.service }))).toEqual([
      ["2026", ["e5", "d4", "c3", "b2", "a1"]],
    ]);
  });

  it("lists the records under no heading where nothing is grouped", async () => {
    const { service } = makeTimeline({ group: "none", limit: 5 });
    const wrapper = await mountTimeline({ service });
    expect(read(wrapper)).toEqual([["", ["e5", "d4", "c3", "b2", "a1"]]]);
  });

  it("selects a record when its label is pressed", async () => {
    const { service } = makeTimeline();
    const wrapper = await mountTimeline({ service });
    const card = wrapper.get('[data-key="d4"]');
    const label = card.get(".f-data-timeline-record-label");
    expect(label.attributes("aria-pressed")).toBe("false");
    await label.trigger("click");
    expect(service.selected).toBe("d4");
    expect(label.attributes("aria-pressed")).toBe("true");
    expect(card.attributes("data-selected")).toBe("true");
    expect(wrapper.emitted("selected")?.at(0)).toEqual([
      { id: "test-timeline", key: "d4" },
    ]);
  });

  it("loads the next batch from the button under the records, until there is none", async () => {
    const { service, fetch } = makeTimeline();
    const wrapper = await mountTimeline({ service });
    const more = wrapper.get("button.f-data-timeline-more");
    expect(more.text()).toBe("Load more");
    await more.trigger("click");
    await flushPromises();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(read(wrapper)).toEqual([
      ["Mar 4, 2026", ["e5", "d4"]],
      ["Mar 3, 2026", ["c3", "b2"]],
      ["Feb 27, 2026", ["a1"]],
    ]);
    expect(wrapper.find(".f-data-timeline-more").exists()).toBe(false);
    expect(wrapper.emitted("appended")?.at(0)).toEqual([
      { id: "test-timeline", count: 5, added: 2, more: false },
    ]);
  });

  it("marks itself and holds the button while a batch is out", async () => {
    let settle: (result: FetchResult<Commit>) => void = () => {};
    const { service, fetch } = makeTimeline();
    const wrapper = await mountTimeline({ service });
    fetch.mockImplementationOnce(
      () => new Promise<FetchResult<Commit>>((resolve) => (settle = resolve)),
    );
    await wrapper.get(".f-data-timeline-more").trigger("click");
    expect(wrapper.get(".f-data-timeline").attributes("data-appending")).toBe(
      "true",
    );
    expect(wrapper.get(".f-data-timeline-more").attributes("disabled")).toBe(
      "",
    );
    settle({ data: [], cursor: null });
    await flushPromises();
    expect(wrapper.get(".f-data-timeline").attributes("data-appending")).toBe(
      undefined,
    );
  });

  it("marks itself while a fetch is out", async () => {
    let settle: (result: FetchResult<Commit>) => void = () => {};
    const { service } = makeTimeline(
      {},
      {
        fetch: () =>
          new Promise<FetchResult<Commit>>((resolve) => (settle = resolve)),
      },
    );
    const wrapper = mount(Timeline<Commit>, { props: { service } });
    mounted.push(wrapper);
    expect(wrapper.find(".f-data-timeline-empty").exists()).toBe(false);
    const pending = service.init();
    await nextTick();
    expect(wrapper.get(".f-data-timeline").attributes("data-loading")).toBe(
      "true",
    );
    settle({ data: [] });
    await pending;
  });

  it("says so when there is no record", async () => {
    const { service } = makeTimeline({}, {}, []);
    const wrapper = await mountTimeline({ service });
    expect(wrapper.get(".f-data-timeline-empty").text()).toBe("Nothing yet");
    expect(wrapper.find(".f-data-timeline-groups").exists()).toBe(false);
    expect(wrapper.find(".f-data-timeline-more").exists()).toBe(false);
  });

  it("renders the search where the service is searchable, and the refresh", async () => {
    const plainTimeline = await mountTimeline(makeTimeline());
    expect(plainTimeline.find(".f-data-timeline-search").exists()).toBe(false);
    const { service, fetch } = makeTimeline({
      fields: { author: { label: "Author" } },
    });
    const wrapper = await mountTimeline({ service });
    expect(wrapper.find(".f-data-timeline-search").exists()).toBe(true);
    await wrapper.get('button[aria-label="Refresh"]').trigger("click");
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("draws a consumer's own card in the record slot", async () => {
    const { service } = makeTimeline();
    const wrapper = await mountTimeline(
      { service },
      {
        record: `<template #record="{ item, group }"><div class="card">{{ group.key }} {{ item.record.author }}: {{ item.label }}</div></template>`,
      },
    );
    expect(wrapper.findAll(".card").map((card) => card.text())).toEqual([
      "2026-03-04 ada: Fix the build",
      "2026-03-04 linus: Add a loader",
      "2026-03-03 ada: Tidy the types",
    ]);
    expect(wrapper.find(".f-data-timeline-record").exists()).toBe(false);
  });

  it("fills the card's slots around what it holds", async () => {
    const { service } = makeTimeline();
    const wrapper = await mountTimeline(
      { service },
      {
        recordPrepend: `<template #recordPrepend="{ item }"><i class="pre">{{ item.record.author }}</i></template>`,
        recordLabel: `<template #recordLabel="{ item }"><b>{{ item.key }}</b></template>`,
        recordAppend: `<template #recordAppend="{ item }"><code class="post">{{ item.record.sha }}</code></template>`,
        heading: `<template #heading="{ group }"><h4 class="head">{{ group.items.length }} on {{ group.label }}</h4></template>`,
      },
    );
    const card = wrapper.get('[data-key="e5"]');
    expect(
      Array.from(card.element.children).map((child) => child.tagName),
    ).toEqual(["I", "BUTTON", "TIME", "CODE"]);
    expect(card.get(".f-data-timeline-record-label b").text()).toBe("e5");
    expect(wrapper.get(".head").text()).toBe("2 on Mar 4, 2026");
  });
});
