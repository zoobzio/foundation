import type { CalendarProps } from "../../src/types/components/calendar";
import type { Doc } from "@zoobzio/calendar";

import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { nextTick } from "vue";
import Calendar from "../../src/components/calendar.vue";
import { makeCalendar } from "#test/mount/calendar";

const mounted: { unmount: () => void }[] = [];

const mountCalendar = async (
  props: CalendarProps<Doc, Doc>,
  slots: Record<string, string> = {},
) => {
  await props.service.init();
  const wrapper = mount(Calendar<Doc, Doc>, {
    props,
    slots,
    attachTo: document.body,
  });
  mounted.push(wrapper);
  return wrapper;
};

/** Text with each run of whitespace, the narrow ones `Intl` writes included, as one space. */
const plain = (text: string) => text.replace(/\s+/g, " ");

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("calendar", () => {
  it("shows the month as weeks of days under the weekdays", async () => {
    const { service } = makeCalendar();
    const wrapper = await mountCalendar({ service });
    expect(wrapper.get(".f-data-calendar").attributes("data-view")).toBe(
      "month",
    );
    expect(wrapper.get(".f-data-calendar-heading").text()).toBe("March 2026");
    expect(
      wrapper.findAll(".f-data-calendar-weekday").map((th) => th.text()),
    ).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
    expect(wrapper.findAll(".f-data-calendar-week")).toHaveLength(6);
    const days = wrapper.findAll(".f-data-calendar-day");
    expect(days).toHaveLength(42);
    expect(days[0]?.attributes("data-date")).toBe("2026-02-23");
    expect(days[0]?.attributes("data-outside")).toBe("true");
    const today = wrapper.get('[data-date="2026-03-04"]');
    expect(today.attributes("data-today")).toBe("true");
    expect(today.attributes("data-outside")).toBe(undefined);
    expect(
      today.get(".f-data-calendar-day-label").attributes("aria-current"),
    ).toBe("date");
  });

  it("lists each day's occurrences, with a time unless it is all day", async () => {
    const { service } = makeCalendar();
    const wrapper = await mountCalendar({ service });
    const on = (date: string) =>
      wrapper
        .get(`[data-date="${date}"]`)
        .findAll(".f-data-calendar-occurrence")
        .map((button) =>
          [
            button.find("time").exists()
              ? plain(button.get("time").text())
              : "",
            button.get(".f-span").text(),
          ]
            .join(" ")
            .trim(),
        );
    expect(on("2026-03-02")).toEqual(["9:00 AM Standup"]);
    expect(on("2026-03-04")).toEqual(["12:30 PM Lunch"]);
    expect(on("2026-03-06")).toEqual(["5:00 PM Report"]);
    expect(on("2026-03-10")).toEqual(["Untitled"]);
    expect(on("2026-03-11")).toEqual(["Untitled"]);
    expect(on("2026-03-12")).toEqual([]);
    const offsite = wrapper.get('[data-key="offsite"]');
    expect(offsite.attributes("data-all-day")).toBe("true");
    expect(offsite.attributes("data-type")).toBe("Event");
    expect(wrapper.get('[data-key="report"]').attributes("data-type")).toBe(
      "Task",
    );
  });

  it("reads times in the calendar's zone and text in its locale", async () => {
    const { service } = makeCalendar({
      timeZone: "Europe/Amsterdam",
      locale: "nl-NL",
      firstDayOfWeek: "su",
    });
    const wrapper = await mountCalendar({ service });
    expect(wrapper.get(".f-data-calendar-heading").text()).toBe("maart 2026");
    expect(wrapper.get(".f-data-calendar-weekday").text()).toBe("zo");
    expect(
      wrapper.get('[data-key="lunch"] .f-data-calendar-occurrence-time').text(),
    ).toBe("12:30");
  });

  it("selects an occurrence when it is pressed", async () => {
    const { service } = makeCalendar();
    const wrapper = await mountCalendar({ service });
    const lunch = wrapper.get('[data-key="lunch"]');
    expect(lunch.attributes("aria-pressed")).toBe("false");
    await lunch.trigger("click");
    expect(service.selected).toBe("lunch");
    expect(lunch.attributes("aria-pressed")).toBe("true");
    expect(lunch.attributes("data-selected")).toBe("true");
    expect(wrapper.emitted("selected")?.at(0)).toEqual([
      { id: "test-calendar", key: "lunch" },
    ]);
  });

  it("moves with the toolbar and fetches the new range", async () => {
    const { service, fetch } = makeCalendar();
    const wrapper = await mountCalendar({ service });
    const press = (name: string) =>
      wrapper.get(`button[aria-label="${name}"]`).trigger("click");
    expect(
      wrapper.get('button[data-tool="today"]').attributes("disabled"),
    ).toBe("");
    await press("Next");
    expect(service.date).toBe("2026-04-04");
    expect(
      wrapper.get('button[data-tool="today"]').attributes("disabled"),
    ).toBe(undefined);
    expect(wrapper.get(".f-data-calendar-heading").text()).toBe("April 2026");
    await press("Previous");
    await press("Previous");
    expect(service.date).toBe("2026-02-04");
    await press("Today");
    expect(service.date).toBe("2026-03-04");
    expect(fetch).toHaveBeenCalledTimes(5);
    expect(wrapper.emitted("navigated")).toHaveLength(4);
    await flushPromises();
    expect(wrapper.emitted("loaded")).toHaveLength(4);
  });

  it("switches views through the view tools", async () => {
    const { service } = makeCalendar();
    const wrapper = await mountCalendar({ service });
    const views = wrapper.findAll('button[data-group="views"]');
    expect(views.map((item) => item.text())).toEqual([
      "Month",
      "Week",
      "Day",
      "Agenda",
    ]);
    expect(views.map((item) => item.attributes("aria-pressed"))).toEqual([
      "true",
      "false",
      "false",
      "false",
    ]);
    await views[1]?.trigger("click");
    expect(service.view).toBe("week");
    expect(views[1]?.attributes("aria-pressed")).toBe("true");
    expect(views[0]?.attributes("aria-pressed")).toBe("false");
    expect(wrapper.findAll(".f-data-calendar-week")).toHaveLength(1);
    expect(wrapper.findAll(".f-data-calendar-day")).toHaveLength(7);
    expect(plain(wrapper.get(".f-data-calendar-heading").text())).toBe(
      "Mar 2 – 8, 2026",
    );
  });

  it("opens a day from its date", async () => {
    const { service } = makeCalendar();
    const wrapper = await mountCalendar({ service });
    await wrapper
      .get('[data-date="2026-03-10"] .f-data-calendar-day-label')
      .trigger("click");
    expect(service.view).toBe("day");
    expect(service.date).toBe("2026-03-10");
    await nextTick();
    expect(wrapper.findAll(".f-data-calendar-weekday")).toHaveLength(1);
    expect(wrapper.get(".f-data-calendar-heading").text()).toBe(
      "Tuesday, March 10, 2026",
    );
  });

  it("stays on the date where the service offers no day view", async () => {
    const { service } = makeCalendar({ views: ["month"] });
    const wrapper = await mountCalendar({ service });
    expect(wrapper.find('[data-group="views"]').exists()).toBe(false);
    expect(wrapper.find(".f-data-calendar-separator").exists()).toBe(false);
    await wrapper
      .get('[data-date="2026-03-10"] .f-data-calendar-day-label')
      .trigger("click");
    expect(service.view).toBe("month");
    expect(service.date).toBe("2026-03-10");
  });

  it("lists the agenda's days that hold an occurrence", async () => {
    const { service } = makeCalendar({ view: "agenda" });
    const wrapper = await mountCalendar({ service });
    expect(wrapper.find(".f-data-calendar-grid").exists()).toBe(false);
    const days = wrapper.findAll(
      ".f-data-calendar-agenda > .f-data-calendar-day",
    );
    expect(days.map((day) => day.attributes("data-date"))).toEqual([
      "2026-03-04",
      "2026-03-06",
      "2026-03-09",
      "2026-03-10",
      "2026-03-11",
      "2026-03-16",
      "2026-03-23",
      "2026-03-30",
    ]);
    expect(days[0]?.get(".f-data-calendar-day-label").text()).toBe(
      "Wednesday, March 4, 2026",
    );
  });

  it("says so when the agenda is empty", async () => {
    const { service } = makeCalendar({ view: "agenda" }, {}, []);
    const wrapper = await mountCalendar({ service });
    expect(wrapper.get(".f-data-calendar-empty").text()).toBe(
      "Nothing scheduled",
    );
  });

  it("marks itself while a fetch is out", async () => {
    let settle: (entries: Doc) => void = () => {};
    const { service } = makeCalendar(
      {},
      { fetch: () => new Promise<Doc>((resolve) => (settle = resolve)) },
    );
    const wrapper = mount(Calendar<Doc, Doc>, { props: { service } });
    mounted.push(wrapper);
    const pending = service.init();
    await nextTick();
    expect(wrapper.get(".f-data-calendar").attributes("data-loading")).toBe(
      "true",
    );
    settle([]);
    await pending;
    await nextTick();
    expect(wrapper.get(".f-data-calendar").attributes("data-loading")).toBe(
      undefined,
    );
  });

  it("lets passthrough reach a part and a slot replace one", async () => {
    const { service } = makeCalendar();
    const wrapper = await mountCalendar(
      {
        service,
        pt: {
          tool: (tool) => (tool.key === "today" ? { label: "Now" } : {}),
          day: (day) => ({ title: day.name }),
        },
      },
      {
        occurrenceLabel: `<template #occurrenceLabel="{ occurrence }">[{{ occurrence.uid }}]</template>`,
        heading: `<template #heading="{ heading }"><h3>{{ heading }}!</h3></template>`,
      },
    );
    expect(wrapper.find('button[aria-label="Now"]').exists()).toBe(true);
    expect(wrapper.get('[data-date="2026-03-04"]').attributes("title")).toBe(
      "Wednesday, March 4, 2026",
    );
    expect(wrapper.get('[data-key="lunch"]').text()).toContain("[lunch]");
    expect(wrapper.get("h3").text()).toBe("March 2026!");
  });

  it("renders the toolbar as one group of tools after another", async () => {
    const { service } = makeCalendar();
    const wrapper = await mountCalendar({ service });
    const toolbar = wrapper.get(".f-data-calendar-toolbar");
    expect(toolbar.attributes("role")).toBe("toolbar");
    expect(
      toolbar
        .findAll(".f-data-calendar-tool")
        .map((tool) => [
          tool.attributes("data-tool"),
          tool.attributes("data-group"),
        ]),
    ).toEqual([
      ["today", "navigate"],
      ["prev", "navigate"],
      ["next", "navigate"],
      ["month", "views"],
      ["week", "views"],
      ["day", "views"],
      ["agenda", "views"],
    ]);
    expect(toolbar.findAll(".f-data-calendar-separator")).toHaveLength(1);
    expect(
      wrapper.get('button[data-tool="prev"]').attributes("aria-pressed"),
    ).toBe(undefined);
  });

  it("takes controls of the consumer's beside its tools, and a tool's content", async () => {
    const { service } = makeCalendar();
    const wrapper = await mountCalendar(
      { service },
      {
        toolbarPrepend: `<button class="first">Filter</button>`,
        toolbarAppend: `<button class="last">New event</button>`,
        toolLabel: `<template #toolLabel="{ tool }"><i>{{ tool.key }}</i></template>`,
      },
    );
    const toolbar = wrapper.get(".f-data-calendar-toolbar").element;
    expect(toolbar.firstElementChild?.className).toBe("first");
    expect(toolbar.lastElementChild?.className).toBe("last");
    const next = wrapper.get('button[data-tool="next"]');
    expect(next.get("i").text()).toBe("next");
    expect(next.attributes("aria-label")).toBe("Next");
  });

  it("renders no search unless the service is searchable", async () => {
    const { service } = makeCalendar();
    const wrapper = await mountCalendar({ service });
    expect(wrapper.find(".f-data-calendar-search").exists()).toBe(false);
  });

  it("searches through the query: a committed clause refetches the range", async () => {
    const { service, fetch } = makeCalendar({
      fields: { team: { label: "Team", values: ["Design", "Platform"] } },
    });
    const wrapper = await mountCalendar({
      service,
      pt: { search: { placeholder: "Find" } },
    });
    const input = wrapper.get(".f-data-calendar-search input");
    expect(input.attributes("placeholder")).toBe("Find");
    await input.setValue("Team: Design");
    await input.trigger("keydown", { key: "Enter" });
    await flushPromises();
    expect(service.query.filters).toEqual([{ key: "team", value: "Design" }]);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenLastCalledWith(
      {
        range: service.range,
        query: "",
        filters: [{ key: "team", value: "Design" }],
      },
      service,
    );
    expect(wrapper.findAll(".f-chip").map((c) => c.text())).toEqual([
      "Team: Design",
    ]);
    expect(wrapper.emitted("filtered")).toHaveLength(1);
  });

  it("stands the search over the toolbar, outside it", async () => {
    const { service } = makeCalendar({
      fields: { team: { label: "Team" } },
    });
    const wrapper = await mountCalendar({ service });
    const controls = wrapper.get(".f-data-calendar-controls");
    expect(controls.find(".f-data-calendar-search").exists()).toBe(true);
    const body = wrapper.get(".f-data-calendar-body");
    expect(body.find(".f-data-calendar-search").exists()).toBe(false);
    expect(body.find(".f-data-calendar-toolbar").exists()).toBe(true);
    expect(body.find(".f-data-calendar-grid").exists()).toBe(true);
  });

  it("refreshes from a menu where the calendar has a sync", async () => {
    const refresh = vi.fn(async () => false);
    const { service, fetch } = makeCalendar({}, { refresh });
    const wrapper = await mountCalendar({ service });
    const root = wrapper.get(".f-data-calendar");
    const trigger = wrapper.get(
      '.f-data-calendar-controls button[aria-label="Refresh"]',
    );
    const item = (label: string) =>
      Array.from(
        document.body.querySelectorAll<HTMLElement>('[role="menuitem"]'),
      ).find((el) => el.textContent?.includes(label));
    const open = async () => {
      await trigger.trigger("click", { button: 0, ctrlKey: false });
      await flushPromises();
    };
    // The button opens the menu: it fetches nothing itself.
    await open();
    expect(fetch).toHaveBeenCalledOnce();
    expect(item("Off")?.hasAttribute("data-current")).toBe(true);
    expect(root.attributes("data-live")).toBeUndefined();

    item("Every 30 seconds")?.click();
    await flushPromises();
    expect(service.sync?.interval).toBe(30_000);
    expect(root.attributes("data-live")).toBe("true");
    await open();
    expect(item("Every 30 seconds")?.hasAttribute("data-current")).toBe(true);

    item("Refresh now")?.click();
    await flushPromises();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(refresh).not.toHaveBeenCalled();
  });

  it("refetches the range from the refresh control", async () => {
    const { service, fetch } = makeCalendar();
    const wrapper = await mountCalendar({ service });
    const refresh = wrapper.get(
      '.f-data-calendar-controls button[aria-label="Refresh"]',
    );
    expect(refresh.text()).toBe("Refresh");
    await refresh.trigger("click");
    await flushPromises();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenLastCalledWith(
      { range: service.range, query: "", filters: [] },
      service,
    );
  });

  it("exposes its context", async () => {
    const { service } = makeCalendar();
    const wrapper = await mountCalendar({ service });
    expect(wrapper.vm.ctx.id).toBe("calendar");
    expect(wrapper.vm.ctx.weeks).toHaveLength(6);
    expect(wrapper.vm.ctx.tools).toHaveLength(7);
    expect(wrapper.vm.ctx.groups.map((group) => group.name)).toEqual([
      "navigate",
      "views",
    ]);
  });
});
