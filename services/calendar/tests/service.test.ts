// Constructor-injected seams — a plain state container, a vi.fn() Actions
// fake, and vi.fn() listeners. Every test drives a state transition and
// asserts both the new state and the side-channel contracts (the fetch's
// range, the save's mutation, events).
import { describe, expect, it, vi } from "vitest";
import { CalendarService } from "../src/service";
import { createCalendarState } from "../src/state";
import { json } from "../src/json";
import type {
  Actions,
  Config,
  Doc,
  Mutation,
  Options,
  State,
} from "../src/types";
import type { Entry } from "../src/jscalendar";
import { event } from "./data";

const NOW = new Date("2026-03-04T12:00:00Z");

const weekly = () =>
  event("w", "2026-03-02T09:00:00", {
    title: "Standup",
    recurrenceRule: { frequency: "weekly" },
  });

const make = (
  overrides: {
    entries?: Entry[];
    config?: Config;
    actions?: Partial<Actions<Doc, Doc>>;
    state?: State;
    options?: Options;
  } = {},
) => {
  const config = overrides.config ?? {};
  const state = overrides.state ?? createCalendarState(config, () => NOW);
  const fetch = vi.fn(async (): Promise<Doc> => overrides.entries ?? []);
  let made = 0;
  const actions: Actions<Doc, Doc> = {
    ...json,
    fetch,
    now: () => NOW,
    uid: () => `new-${++made}`,
    ...overrides.actions,
  };
  const service = new CalendarService(
    "cal",
    config,
    state,
    actions,
    overrides.options,
  );
  return { service, state, fetch, actions };
};

const loaded = async (
  entries: Entry[],
  rest: Parameters<typeof make>[0] = {},
) => {
  const made = make({ entries, ...rest });
  await made.service.init();
  return made;
};

describe("a fresh calendar", () => {
  it("starts on today in the first view, with nothing loaded", () => {
    const { service } = make();
    expect(service.view).toBe("month");
    expect(service.date).toBe("2026-03-04");
    expect(service.today).toBe("2026-03-04");
    expect(service.entries).toEqual([]);
    expect(service.occurrences).toEqual([]);
    expect(service.initialized).toBe(false);
    expect(service.context).toEqual({ timeZone: "UTC", locale: "en-US" });
  });

  it("reads today in the config's zone and starts in its view", () => {
    const { service } = make({
      config: { timeZone: "Pacific/Auckland", views: ["week", "day"] },
    });
    expect(service.date).toBe("2026-03-05");
    expect(service.view).toBe("week");
    expect(service.views).toEqual(["week", "day"]);
  });

  it("spans the weeks of the month, from the configured first day", () => {
    const { service } = make({ config: { firstDayOfWeek: "su" } });
    expect(service.days[0]).toBe("2026-03-01");
    expect(service.range).toEqual({
      start: "2026-03-01T00:00:00Z",
      end: "2026-04-05T00:00:00Z",
    });
  });
});

describe("loading", () => {
  it("init fetches the range once, through the reader", async () => {
    const read = vi.fn((source: Doc) => source.slice(0, 1));
    const { service, fetch } = make({
      entries: [
        event("a", "2026-03-02T09:00:00"),
        event("b", "2026-03-03T09:00:00"),
      ],
      actions: { read },
    });
    const heard = vi.fn();
    service.on("loaded", heard);
    expect(await service.init()).toBe(true);
    await service.init();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      { range: service.range, query: "", filters: [] },
      service,
    );
    expect(read).toHaveBeenCalledWith(expect.any(Array), service.context);
    expect(service.entries.map((e) => e.uid)).toEqual(["a"]);
    expect(service.revision).toBe(1);
    expect(service.loading).toBe(false);
    expect(heard).toHaveBeenCalledWith({
      id: "cal",
      range: service.range,
      revision: 1,
    });
  });

  it("settles loading and emits when the fetch fails", async () => {
    const { service } = make({
      actions: { fetch: vi.fn(async () => Promise.reject(new Error("down"))) },
    });
    const heard = vi.fn();
    service.on("loaded", heard);
    await expect(service.fetch()).rejects.toThrow("down");
    expect(service.loading).toBe(false);
    expect(heard).toHaveBeenCalledTimes(1);
  });

  it("drops a fetch that settles after a later one began", async () => {
    const answers: ((entries: Doc) => void)[] = [];
    const { service } = make({
      actions: {
        fetch: vi.fn(
          () => new Promise<Doc>((resolve) => answers.push(resolve)),
        ),
      },
    });
    const first = service.fetch();
    const second = service.fetch();
    answers[1]?.([event("late", "2026-03-02T09:00:00")]);
    await second;
    answers[0]?.([event("early", "2026-03-02T09:00:00")]);
    await first;
    expect(service.entries.map((e) => e.uid)).toEqual(["late"]);
    expect(service.loading).toBe(false);
  });

  it("load replaces the entries with no fetch", () => {
    const { service, fetch } = make();
    service.load([event("a", "2026-03-02T09:00:00")]);
    expect(fetch).not.toHaveBeenCalled();
    expect(service.initialized).toBe(true);
    expect(service.occurrences).toHaveLength(1);
    expect(service.document).toEqual(service.entries);
  });
});

describe("navigation", () => {
  it("moves the view and the date, emits, and fetches the new range", async () => {
    const { service, fetch } = await loaded([]);
    const heard = vi.fn();
    service.on("navigated", heard);
    service.show("week");
    expect(service.days).toHaveLength(7);
    service.next();
    expect(service.date).toBe("2026-03-11");
    service.prev();
    service.go("2026-07-01");
    expect(heard).toHaveBeenCalledTimes(4);
    expect(heard).toHaveBeenLastCalledWith({
      id: "cal",
      view: "week",
      date: "2026-07-01",
      range: { start: "2026-06-29T00:00:00Z", end: "2026-07-06T00:00:00Z" },
    });
    expect(fetch).toHaveBeenCalledTimes(5);
    expect(fetch).toHaveBeenLastCalledWith(
      { range: service.range, query: "", filters: [] },
      service,
    );
  });

  it("ignores a view it does not offer, the view it is in, and the date it is on", async () => {
    const { service, fetch } = await loaded([], {
      config: { views: ["month", "day"] },
    });
    service.show("week");
    service.show("month");
    service.go("2026-03-04");
    expect(service.view).toBe("month");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(() => service.go("nope")).toThrow(RangeError);
  });

  it("reads the occurrences of the range it moved to", async () => {
    const { service } = await loaded([weekly()]);
    service.show("day");
    service.go("2026-03-09");
    expect(service.occurrences.map((o) => o.key)).toEqual([
      "w#2026-03-09T09:00:00",
    ]);
    expect(service.occurrence("w#2026-03-09T09:00:00")?.uid).toBe("w");
    expect(service.occurrence("w#2026-03-02T09:00:00")).toBeUndefined();
  });
});

describe("occurrencesOn", () => {
  it("gives the occurrences that touch a day, a spanning one on each", async () => {
    const { service } = await loaded([
      event("trip", "2026-03-03T18:00:00", { duration: "P2D" }),
      event("lunch", "2026-03-04T12:00:00"),
      event("late", "2026-03-04T23:00:00", { duration: "PT1H" }),
    ]);
    const on = (day: string) => service.occurrencesOn(day).map((o) => o.key);
    expect(on("2026-03-02")).toEqual([]);
    expect(on("2026-03-03")).toEqual(["trip"]);
    expect(on("2026-03-04")).toEqual(["trip", "lunch", "late"]);
    expect(on("2026-03-05")).toEqual(["trip"]);
    expect(on("2026-03-06")).toEqual([]);
  });
});

describe("selection", () => {
  it("holds a key and emits when it changes", () => {
    const { service } = make();
    const heard = vi.fn();
    service.on("selected", heard);
    service.select("a");
    service.select("a");
    service.select(null);
    expect(service.selected).toBeNull();
    expect(heard.mock.calls).toEqual([
      [{ id: "cal", key: "a" }],
      [{ id: "cal", key: null }],
    ]);
  });
});

describe("the state container", () => {
  it("passes writes through the middleware and emits each change", async () => {
    const { service } = make({
      entries: [event("a", "2026-03-02T09:00:00")],
      options: {
        set: { state: { entries: (entries) => entries.slice(0, 0) } },
      },
    });
    const heard = vi.fn();
    service.on("change", heard);
    await service.init();
    expect(service.entries).toEqual([]);
    expect(heard).toHaveBeenCalledWith({
      field: "initialized",
      before: false,
      after: true,
    });
  });

  it("returns the occurrences it read while nothing has moved", async () => {
    const { service } = await loaded([weekly()]);
    const first = service.occurrences;
    expect(service.occurrences).toBe(first);
    service.go("2026-04-15");
    expect(service.occurrences).not.toBe(first);
  });
});

describe("create", () => {
  it("adds the entry, saves it, and emits once it stands", async () => {
    const save = vi.fn(async (_mutation: Mutation<Doc>) => {});
    const { service } = await loaded([], { actions: { save } });
    const heard = vi.fn();
    service.on("changed", heard);
    const entry = event("a", "2026-03-02T09:00:00");
    await service.create(entry);
    const mutation: Mutation<Doc> = {
      scope: "all",
      entries: [entry],
      removed: [],
    };
    expect(service.entries).toEqual([entry]);
    expect(save).toHaveBeenCalledWith(mutation, service);
    expect(heard).toHaveBeenCalledWith({ id: "cal", revision: 2, mutation });
  });

  it("puts the entries back when the save rejects", async () => {
    const save = vi.fn(async () => Promise.reject(new Error("refused")));
    const { service } = await loaded([], { actions: { save } });
    const heard = vi.fn();
    service.on("changed", heard);
    await expect(
      service.create(event("a", "2026-03-02T09:00:00")),
    ).rejects.toThrow("refused");
    expect(service.entries).toEqual([]);
    expect(service.revision).toBe(3);
    expect(heard).not.toHaveBeenCalled();
  });

  it("writes the mutation through the writer", async () => {
    const save = vi.fn(async (_mutation: Mutation<Doc>) => {});
    const { service } = await loaded([], {
      actions: {
        save,
        write: (entries) => entries.map((e) => ({ ...e, title: "W" })),
      },
    });
    await service.create(event("a", "2026-03-02T09:00:00"));
    expect(save.mock.calls[0]?.[0].entries[0]?.title).toBe("W");
  });
});

describe("update", () => {
  it("patches an entry that does not recur, and moves its sequence on", async () => {
    const { service } = await loaded([event("a", "2026-03-02T09:00:00")]);
    await service.update("a", { title: "New", duration: "PT2H" }, "one");
    expect(service.entries[0]).toMatchObject({
      title: "New",
      duration: "PT2H",
      updated: "2026-03-04T12:00:00Z",
      sequence: 1,
    });
    expect(service.occurrence("a")?.end).toBe("2026-03-02T11:00:00Z");
  });

  it("writes a change to one occurrence into the overrides", async () => {
    const save = vi.fn(async (_mutation: Mutation<Doc>) => {});
    const { service } = await loaded([weekly()], { actions: { save } });
    await service.update("w#2026-03-09T09:00:00", {
      start: "2026-03-09T14:00:00",
    });
    await service.update("w#2026-03-09T09:00:00", { title: "Moved" });
    expect(service.entries[0]?.recurrenceOverrides).toEqual({
      "2026-03-09T09:00:00": { start: "2026-03-09T14:00:00", title: "Moved" },
    });
    expect(service.occurrence("w#2026-03-09T09:00:00")?.start).toBe(
      "2026-03-09T14:00:00Z",
    );
    expect(service.occurrence("w#2026-03-16T09:00:00")?.entry.title).toBe(
      "Standup",
    );
    expect(save.mock.calls[0]?.[0].scope).toBe("one");
  });

  it("refuses a change to one occurrence that reaches its entry", async () => {
    const { service } = await loaded([weekly()]);
    await expect(
      service.update("w#2026-03-09T09:00:00", { uid: "x" }),
    ).rejects.toThrow("cannot change its entry");
    await expect(
      service.update("w#2026-03-09T09:00:00", { excluded: true }),
    ).rejects.toThrow("cannot change its entry");
    expect(service.entries).toEqual([weekly()]);
  });

  it("patches the whole entry", async () => {
    const { service } = await loaded([weekly()]);
    await service.update("w#2026-03-09T09:00:00", { title: "All" }, "all");
    expect(service.entries).toHaveLength(1);
    expect(service.occurrences.every((o) => o.entry.title === "All")).toBe(
      true,
    );
  });

  it("cuts the entry in two for this and every later occurrence", async () => {
    const save = vi.fn(async (_mutation: Mutation<Doc>) => {});
    const { service } = await loaded(
      [
        {
          ...weekly(),
          recurrenceOverrides: {
            "2026-03-09T09:00:00": { title: "Early" },
            "2026-03-23T09:00:00": { title: "Late" },
          },
        },
      ],
      { actions: { save } },
    );
    await service.update(
      "w#2026-03-16T09:00:00",
      { title: "Sync", locations: { room: { name: "Room 202" } } },
      "following",
    );
    const [head, tail] = service.entries;
    expect(head).toMatchObject({
      uid: "w",
      title: "Standup",
      recurrenceRule: { frequency: "weekly", until: "2026-03-09T09:00:00" },
      recurrenceOverrides: { "2026-03-09T09:00:00": { title: "Early" } },
      relatedTo: { "new-1": { relation: { next: true } } },
      sequence: 1,
    });
    expect(tail).toMatchObject({
      uid: "new-1",
      title: "Sync",
      start: "2026-03-16T09:00:00",
      locations: { room: { name: "Room 202" } },
      recurrenceRule: { frequency: "weekly" },
      recurrenceOverrides: { "2026-03-23T09:00:00": { title: "Late" } },
      relatedTo: { w: { relation: { first: true } } },
    });
    expect(tail?.sequence).toBeUndefined();
    expect(service.occurrences.map((o) => [o.start, o.entry.title])).toEqual([
      ["2026-03-02T09:00:00Z", "Standup"],
      ["2026-03-09T09:00:00Z", "Early"],
      ["2026-03-16T09:00:00Z", "Sync"],
      ["2026-03-23T09:00:00Z", "Late"],
      ["2026-03-30T09:00:00Z", "Sync"],
    ]);
    expect(save.mock.calls[0]?.[0]).toMatchObject({
      scope: "following",
      removed: [],
    });
    expect(save.mock.calls[0]?.[0].entries).toHaveLength(2);
  });

  it("carries what is left of a count to the entry that follows", async () => {
    const { service } = await loaded([
      event("w", "2026-03-02T09:00:00", {
        recurrenceRule: { frequency: "weekly", count: 4 },
      }),
    ]);
    await service.update(
      "w#2026-03-16T09:00:00",
      { start: "2026-03-17T10:00:00" },
      "following",
    );
    expect(service.entries[0]?.recurrenceRule).toEqual({
      frequency: "weekly",
      until: "2026-03-09T09:00:00",
    });
    expect(service.entries[1]?.recurrenceRule).toEqual({
      frequency: "weekly",
      count: 2,
    });
    expect(service.occurrences.map((o) => o.start)).toEqual([
      "2026-03-02T09:00:00Z",
      "2026-03-09T09:00:00Z",
      "2026-03-17T10:00:00Z",
      "2026-03-24T10:00:00Z",
    ]);
  });

  it("drops the later overrides when the start moves", async () => {
    const { service } = await loaded([
      {
        ...weekly(),
        recurrenceOverrides: { "2026-03-23T09:00:00": { title: "Late" } },
      },
    ]);
    await service.update(
      "w#2026-03-16T09:00:00",
      { start: "2026-03-17T10:00:00" },
      "following",
    );
    expect(service.entries[1]?.recurrenceOverrides).toBeUndefined();
  });

  it("reaches the whole entry from its first occurrence", async () => {
    const { service } = await loaded([weekly()]);
    await service.update(
      "w#2026-03-02T09:00:00",
      { title: "All" },
      "following",
    );
    expect(service.entries).toHaveLength(1);
    expect(service.entries[0]?.title).toBe("All");
  });

  it("refuses a key that is not in the range, and a patch that does not apply", async () => {
    const { service } = await loaded([event("a", "2026-03-02T09:00:00")]);
    await expect(service.update("nope", { title: "x" })).rejects.toThrow(
      "No occurrence",
    );
    await expect(
      service.update("a", { "locations/x/name": "y" }),
    ).rejects.toThrow("has no parent");
    expect(service.revision).toBe(1);
  });
});

describe("remove", () => {
  it("removes an entry that does not recur", async () => {
    const save = vi.fn(async (_mutation: Mutation<Doc>) => {});
    const entry = event("a", "2026-03-02T09:00:00");
    const { service } = await loaded(
      [entry, event("b", "2026-03-03T09:00:00")],
      {
        actions: { save },
      },
    );
    await service.remove("a");
    expect(service.entries.map((e) => e.uid)).toEqual(["b"]);
    expect(save).toHaveBeenCalledWith(
      { scope: "all", entries: [], removed: [entry] },
      service,
    );
  });

  it("excludes one occurrence", async () => {
    const { service } = await loaded([weekly()]);
    await service.update("w#2026-03-09T09:00:00", { title: "Moved" });
    await service.remove("w#2026-03-09T09:00:00");
    expect(service.entries[0]?.recurrenceOverrides).toEqual({
      "2026-03-09T09:00:00": { excluded: true },
    });
    expect(service.occurrences.map((o) => o.start)).not.toContain(
      "2026-03-09T09:00:00Z",
    );
  });

  it("ends the rule before this and every later occurrence", async () => {
    const { service } = await loaded([weekly()]);
    await service.remove("w#2026-03-16T09:00:00", "following");
    expect(service.entries).toHaveLength(1);
    expect(service.entries[0]?.recurrenceRule?.until).toBe(
      "2026-03-09T09:00:00",
    );
    expect(service.entries[0]?.relatedTo).toBeUndefined();
    expect(service.occurrences).toHaveLength(2);
  });

  it("removes the whole entry", async () => {
    const { service } = await loaded([weekly()]);
    await service.remove("w#2026-03-16T09:00:00", "all");
    expect(service.entries).toEqual([]);
  });

  it("puts the entry back when the save rejects", async () => {
    const { service } = await loaded([weekly()], {
      actions: {
        save: vi.fn(async () => Promise.reject(new Error("refused"))),
      },
    });
    await expect(
      service.remove("w#2026-03-16T09:00:00", "all"),
    ).rejects.toThrow("refused");
    expect(service.entries).toEqual([weekly()]);
  });
});

const fields = {
  team: { label: "Team", values: ["Design", "Platform"] },
  status: { label: "Status", operators: ["is", "is not"] },
};

describe("search", () => {
  it("holds the query's clauses and draft in the calendar's container", () => {
    const { service, state } = make({ config: { fields } });
    service.query.setDraft("Team: Des");
    service.query.add({ kind: "filter", key: "team", value: "Design" });
    expect(state.draft).toBe("Team: Des");
    expect(state.clauses).toEqual([
      { kind: "filter", key: "team", value: "Design" },
    ]);
    expect(service.query.fields).toEqual(fields);
  });

  it("a change to the clauses refetches the range with them and emits filtered", async () => {
    const { service, fetch } = await loaded([], { config: { fields } });
    const filtered = vi.fn();
    service.on("filtered", filtered);
    service.query.add({ kind: "literal", key: "text", value: "standup" });
    service.query.add({
      kind: "filter",
      key: "status",
      op: "is",
      value: "confirmed",
    });
    const filters = [{ key: "status", op: "is", value: "confirmed" }];
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(fetch).toHaveBeenLastCalledWith(
      { range: service.range, query: "standup", filters },
      service,
    );
    expect(filtered).toHaveBeenLastCalledWith({
      id: "cal",
      query: "standup",
      filters,
    });
  });

  it("a rejected or repeated clause does not refetch", async () => {
    const { service, fetch } = await loaded([], { config: { fields } });
    service.query.add({ kind: "filter", key: "team", value: "Design" });
    service.query.add({ kind: "filter", key: "team", value: "Design" });
    service.query.add({
      kind: "filter",
      key: "status",
      op: "near",
      value: "x",
    });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("keeps the clauses as the view and the date move", async () => {
    const { service, fetch } = await loaded([], { config: { fields } });
    service.query.add({ kind: "filter", key: "team", value: "Design" });
    service.next();
    expect(fetch).toHaveBeenLastCalledWith(
      {
        range: service.range,
        query: "",
        filters: [{ key: "team", value: "Design" }],
      },
      service,
    );
  });

  it("starts from the config's initial clauses", async () => {
    const initialClauses = [
      { kind: "filter" as const, key: "team", value: "Platform" },
    ];
    const { service, fetch } = make({ config: { fields, initialClauses } });
    await service.init();
    expect(service.query.clauses).toEqual(initialClauses);
    expect(fetch).toHaveBeenCalledWith(
      {
        range: service.range,
        query: "",
        filters: [{ key: "team", value: "Platform" }],
      },
      service,
    );
  });

  it("is searchable where the config names fields or literals, or says so", () => {
    expect(make().service.searchable).toBe(false);
    expect(make({ config: { fields } }).service.searchable).toBe(true);
    expect(make({ config: { literals: {} } }).service.searchable).toBe(true);
    expect(make({ config: { searchable: true } }).service.searchable).toBe(
      true,
    );
    expect(
      make({ config: { fields, searchable: false } }).service.searchable,
    ).toBe(false);
  });
});

describe("views", () => {
  const saved = {
    view: "week" as const,
    clauses: [{ kind: "filter" as const, key: "team", value: "Design" }],
  };

  it("snapshots the view and the clauses", () => {
    const { service } = make({ config: { fields } });
    expect(service.snapshot()).toEqual({ view: "month", clauses: [] });
    service.query.add(saved.clauses[0]!);
    expect(service.snapshot()).toEqual({
      view: "month",
      clauses: saved.clauses,
    });
  });

  it("restores a snapshot in one fetch, and emits", async () => {
    const { service, fetch } = await loaded([], { config: { fields } });
    const navigated = vi.fn();
    const filtered = vi.fn();
    const restored = vi.fn();
    service.on("navigated", navigated);
    service.on("filtered", filtered);
    service.on("restored", restored);
    const date = service.date;
    service.restore(saved);
    expect(service.snapshot()).toEqual(saved);
    expect(service.date).toBe(date);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenLastCalledWith(
      {
        range: service.range,
        query: "",
        filters: [{ key: "team", value: "Design" }],
      },
      service,
    );
    expect(navigated).toHaveBeenCalledTimes(1);
    expect(filtered).toHaveBeenCalledTimes(1);
    expect(restored).toHaveBeenCalledWith({ id: "cal", snapshot: saved });
  });

  it("fetches nothing before init: the first fetch reads what it left", async () => {
    const { service, fetch } = make({ config: { fields } });
    service.restore(saved);
    expect(fetch).not.toHaveBeenCalled();
    await service.init();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      {
        range: service.range,
        query: "",
        filters: [{ key: "team", value: "Design" }],
      },
      service,
    );
  });

  it("leaves out a view the calendar does not offer and a clause the query rejects", async () => {
    const { service } = await loaded([], {
      config: { fields, views: ["month", "agenda"] },
    });
    const navigated = vi.fn();
    service.on("navigated", navigated);
    service.restore({
      view: "week",
      clauses: [{ kind: "filter", key: "status", op: "near", value: "x" }],
    });
    expect(service.snapshot()).toEqual({ view: "month", clauses: [] });
    expect(navigated).not.toHaveBeenCalled();
  });
});
