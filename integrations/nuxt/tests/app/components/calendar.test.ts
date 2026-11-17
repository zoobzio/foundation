// The calendar wrapper: each tool named from the contract, the name its
// accessible name and tooltip, `prev` and `next` drawn as icons, and the
// layer's text for an untitled occurrence and an empty agenda.
import type { Doc } from "@zoobzio/calendar";

import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Calendar from "../../../app/components/calendar";
import { makeCalendar } from "#test/mount/calendar";

const mounted: { unmount: () => void }[] = [];

const mountCalendar = async (
  made: ReturnType<typeof makeCalendar>,
  slots: Record<string, string> = {},
) => {
  await made.service.init();
  const wrapper = mount(Calendar<Doc, Doc>, {
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

describe("calendar wrapper", () => {
  it("draws the steps as icons, named by their labels", async () => {
    const made = makeCalendar();
    const wrapper = await mountCalendar(made);
    for (const [name, alias] of [
      ["Previous", "prev"],
      ["Next", "next"],
    ]) {
      const button = wrapper.get(`button[aria-label="${name}"]`);
      expect(button.text()).toBe("");
      expect(button.get("svg[data-icon]").attributes("data-icon")).toBe(alias);
      expect(button.attributes("title")).toBe(name);
    }
    const today = wrapper.get('button[data-tool="today"]');
    expect(today.get("span.f-span").text()).toBe("Today");
    expect(today.find("svg").exists()).toBe(false);
    expect(today.attributes("title")).toBe("Today");
    await wrapper.get('button[aria-label="Next"]').trigger("click");
    expect(made.service.date).toBe("2026-04-04");
  });

  it("names the views from the contract and switches through them", async () => {
    const made = makeCalendar();
    const wrapper = await mountCalendar(made);
    const views = wrapper.findAll('button[data-group="views"]');
    expect(views.map((item) => item.text())).toEqual([
      "Month",
      "Week",
      "Day",
      "Agenda",
    ]);
    expect(views[0]?.attributes("aria-pressed")).toBe("true");
    await views[3]?.trigger("click");
    expect(made.service.view).toBe("agenda");
    expect(views[3]?.attributes("aria-pressed")).toBe("true");
  });

  it("keeps a title as written and names an untitled occurrence", async () => {
    const wrapper = await mountCalendar(makeCalendar());
    expect(wrapper.get('[data-key="lunch"] .f-span').text()).toBe("Lunch");
    expect(wrapper.get('[data-key="offsite"] .f-span').text()).toBe("Untitled");
  });

  it("dresses the search of a searchable calendar, and renders none otherwise", async () => {
    const plain = await mountCalendar(makeCalendar());
    expect(plain.find(".f-data-calendar-search").exists()).toBe(false);
    const wrapper = await mountCalendar(
      makeCalendar({ fields: { team: { label: "Team" } } }),
    );
    const search = wrapper.get(".f-data-calendar-search");
    expect(search.get("input").attributes("placeholder")).toBe("Search...");
    expect(search.find("kbd").exists()).toBe(true);
  });

  it("says so when the agenda is empty", async () => {
    const wrapper = await mountCalendar(
      makeCalendar({ view: "agenda" }, {}, []),
    );
    expect(wrapper.get(".f-data-calendar-empty").text()).toBe(
      "Nothing scheduled",
    );
  });

  it("lets a consumer's tool label win, and keeps the tool's name", async () => {
    const wrapper = await mountCalendar(makeCalendar(), {
      toolLabel: `<template #toolLabel="{ tool }"><b>{{ tool.key }}</b></template>`,
    });
    const prev = wrapper.get('button[data-tool="prev"]');
    expect(prev.get("b").text()).toBe("prev");
    expect(prev.find("svg").exists()).toBe(false);
    expect(prev.attributes("aria-label")).toBe("Previous");
  });

  it("lets a consumer's pt reach a tool over the layer's", async () => {
    const made = makeCalendar();
    await made.service.init();
    const wrapper = mount(Calendar<Doc, Doc>, {
      props: {
        service: made.service,
        pt: {
          tool: (tool) => (tool.key === "next" ? { title: "Onward" } : {}),
        },
      },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    const next = wrapper.get('button[data-tool="next"]');
    expect(next.attributes("title")).toBe("Onward");
    expect(next.attributes("aria-label")).toBe("Next");
    expect(wrapper.get('button[data-tool="prev"]').attributes("title")).toBe(
      "Previous",
    );
  });
});
