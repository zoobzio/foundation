// Constructor-injected seams — a plain state container, a vi.fn() Actions
// fake over a paged backend, and vi.fn() listeners. Every test drives a
// state transition and asserts both the new state and the side-channel
// contracts (the fetch's params, the events).
import { describe, expect, it, vi } from "vitest";
import { TimelineService } from "../src/service";
import { createTimelineState } from "../src/state";
import type {
  Actions,
  Config,
  FetchParams,
  FetchResult,
  Options,
  State,
} from "../src/types";
import type { Commit } from "./data";
import { commit, commits } from "./data";

const NOW = new Date("2026-03-04T12:00:00Z");

const base: Config<Commit> = { key: "sha", label: "message", limit: 2 };

const fields = {
  author: { label: "Author", values: ["ada", "linus"] },
};

/** A backend that pages by offset, the offset as the cursor. */
const paged =
  (rows: Commit[]) =>
  async ({ cursor, limit }: FetchParams): Promise<FetchResult<Commit>> => {
    const from = Number(cursor ?? 0);
    const next = from + limit;
    return {
      data: rows.slice(from, next),
      cursor: next < rows.length ? String(next) : null,
    };
  };

const make = (
  overrides: {
    rows?: Commit[];
    config?: Partial<Config<Commit>>;
    actions?: Partial<Actions<Commit>>;
    state?: State<Commit>;
    options?: Options<Commit>;
  } = {},
) => {
  const config = { ...base, ...overrides.config };
  const state = overrides.state ?? createTimelineState(config);
  const fetch = vi.fn(paged(overrides.rows ?? commits));
  const actions: Actions<Commit> = {
    fetch,
    now: () => NOW,
    ...overrides.actions,
  };
  const service = new TimelineService<Commit>(
    "log",
    config,
    state,
    actions,
    overrides.options,
  );
  return { service, state, fetch, actions };
};

const loaded = async (rest: Parameters<typeof make>[0] = {}) => {
  const made = make(rest);
  await made.service.init();
  return made;
};

const shas = (records: Commit[]) => records.map((record) => record.sha);

describe("a fresh timeline", () => {
  it("holds nothing, and reads its defaults", () => {
    const { service } = make({ config: { limit: undefined } });
    expect(service.records).toEqual([]);
    expect(service.groups).toEqual([]);
    expect(service.more).toBe(false);
    expect(service.loading).toBe(false);
    expect(service.appending).toBe(false);
    expect(service.initialized).toBe(false);
    expect(service.selected).toBeNull();
    expect(service.order).toBe("desc");
    expect(service.grouping).toBe("day");
    expect(service.limit).toBe(30);
    expect(service.context).toEqual({ timeZone: "UTC", locale: "en-US" });
    expect(service.today).toBe("2026-03-04");
  });

  it("reads today in the config's zone", () => {
    const { service } = make({ config: { timeZone: "Pacific/Auckland" } });
    expect(service.today).toBe("2026-03-05");
  });
});

describe("a record", () => {
  it("is read by the properties the config names", () => {
    const { service } = make();
    const record = commits[0]!;
    expect(service.keyOf(record)).toBe("e5");
    expect(service.timeOf(record)).toEqual(new Date("2026-03-04T16:00:00Z"));
    expect(service.labelOf(record)).toBe("Commit e5");
  });

  it("is read by `id` and `at` where the config names none, and named by its key", () => {
    const state = createTimelineState<{ id: number; at: number }>();
    const service = new TimelineService("plain", {}, state, {
      fetch: async () => ({ data: [] }),
    });
    const record = { id: 7, at: Date.parse("2026-03-04T16:00:00Z") };
    expect(service.keyOf(record)).toBe("7");
    expect(service.timeOf(record)).toEqual(new Date("2026-03-04T16:00:00Z"));
    expect(service.labelOf(record)).toBe("7");
  });

  it("has no time where its property does not read as one, and its key as a name where its label is empty", () => {
    const { service } = make();
    const record = commit("x", "soon", { message: "" });
    expect(service.timeOf(record)).toBeNull();
    expect(service.labelOf(record)).toBe("x");
  });

  it("is found by its key among the records held", async () => {
    const { service } = await loaded();
    expect(service.record("d4")?.sha).toBe("d4");
    expect(service.record("a1")).toBeUndefined();
  });
});

describe("loading", () => {
  it("init fetches the first batch once", async () => {
    const { service, fetch } = make();
    const heard = vi.fn();
    service.on("loaded", heard);
    expect(await service.init()).toBe(true);
    await service.init();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      { cursor: null, limit: 2, query: "", filters: [] },
      service,
    );
    expect(shas(service.records)).toEqual(["e5", "d4"]);
    expect(service.more).toBe(true);
    expect(service.initialized).toBe(true);
    expect(service.loading).toBe(false);
    expect(heard).toHaveBeenCalledWith({ id: "log", count: 2, more: true });
  });

  it("has no more where the fetch names no cursor", async () => {
    const { service } = await loaded({
      actions: { fetch: async () => ({ data: commits }) },
    });
    expect(service.records).toHaveLength(5);
    expect(service.more).toBe(false);
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
    const answers: ((result: FetchResult<Commit>) => void)[] = [];
    const { service } = make({
      actions: {
        fetch: vi.fn(
          () =>
            new Promise<FetchResult<Commit>>((resolve) =>
              answers.push(resolve),
            ),
        ),
      },
    });
    const first = service.fetch();
    const second = service.fetch();
    answers[1]?.({ data: [commits[1]!] });
    await second;
    answers[0]?.({ data: [commits[0]!] });
    await first;
    expect(shas(service.records)).toEqual(["d4"]);
    expect(service.loading).toBe(false);
  });

  it("load replaces the records with no fetch", () => {
    const { service, fetch } = make();
    service.load({ data: commits.slice(0, 3), cursor: "3" });
    expect(fetch).not.toHaveBeenCalled();
    expect(service.initialized).toBe(true);
    expect(service.records).toHaveLength(3);
    expect(service.more).toBe(true);
  });

  it("fetch starts over from the first batch", async () => {
    const { service, fetch } = await loaded();
    await service.loadMore();
    expect(service.records).toHaveLength(4);
    await service.fetch();
    expect(shas(service.records)).toEqual(["e5", "d4"]);
    expect(fetch).toHaveBeenLastCalledWith(
      { cursor: null, limit: 2, query: "", filters: [] },
      service,
    );
  });
});

describe("loadMore", () => {
  it("adds the batch after the records held, until there is none", async () => {
    const { service, fetch } = await loaded();
    const heard = vi.fn();
    service.on("appended", heard);
    await service.loadMore();
    expect(fetch).toHaveBeenLastCalledWith(
      { cursor: "2", limit: 2, query: "", filters: [] },
      service,
    );
    expect(shas(service.records)).toEqual(["e5", "d4", "c3", "b2"]);
    expect(heard).toHaveBeenLastCalledWith({
      id: "log",
      count: 4,
      added: 2,
      more: true,
    });
    await service.loadMore();
    expect(shas(service.records)).toEqual(["e5", "d4", "c3", "b2", "a1"]);
    expect(service.more).toBe(false);
    expect(heard).toHaveBeenLastCalledWith({
      id: "log",
      count: 5,
      added: 1,
      more: false,
    });
    await service.loadMore();
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it("does nothing before the first fetch", async () => {
    const { service, fetch } = make();
    await service.loadMore();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("marks itself while the batch is out, and asks for one at a time", async () => {
    let settle: (result: FetchResult<Commit>) => void = () => {};
    const { service, fetch } = await loaded();
    fetch.mockImplementationOnce(
      () => new Promise<FetchResult<Commit>>((resolve) => (settle = resolve)),
    );
    const out = service.loadMore();
    expect(service.appending).toBe(true);
    expect(service.loading).toBe(false);
    await service.loadMore();
    expect(fetch).toHaveBeenCalledTimes(2);
    settle({ data: [commits[2]!], cursor: null });
    await out;
    expect(service.appending).toBe(false);
    expect(service.records).toHaveLength(3);
  });

  it("settles when the batch fails, and keeps what it holds", async () => {
    const { service, fetch } = await loaded();
    fetch.mockImplementationOnce(async () => Promise.reject(new Error("down")));
    await expect(service.loadMore()).rejects.toThrow("down");
    expect(service.appending).toBe(false);
    expect(service.records).toHaveLength(2);
    expect(service.more).toBe(true);
  });

  it("drops a batch that comes back after the records were fetched anew", async () => {
    let settle: (result: FetchResult<Commit>) => void = () => {};
    const { service, fetch } = await loaded();
    const heard = vi.fn();
    service.on("appended", heard);
    fetch.mockImplementationOnce(
      () => new Promise<FetchResult<Commit>>((resolve) => (settle = resolve)),
    );
    const out = service.loadMore();
    await service.fetch();
    expect(service.appending).toBe(false);
    settle({ data: [commits[4]!], cursor: null });
    await out;
    expect(shas(service.records)).toEqual(["e5", "d4"]);
    expect(service.more).toBe(true);
    expect(heard).not.toHaveBeenCalled();
  });

  it("leaves out a record it already holds", async () => {
    const { service, fetch } = await loaded();
    fetch.mockImplementationOnce(async () => ({
      data: [commits[1]!, commits[2]!],
      cursor: null,
    }));
    await service.loadMore();
    expect(shas(service.records)).toEqual(["e5", "d4", "c3"]);
  });
});

describe("groups", () => {
  it("groups the records under the day each falls on", async () => {
    const { service } = await loaded({ config: { limit: 5 } });
    expect(
      service.groups.map((group) => [group.key, shas(group.records)]),
    ).toEqual([
      ["2026-03-04", ["e5", "d4"]],
      ["2026-03-03", ["c3", "b2"]],
      ["2026-02-27", ["a1"]],
    ]);
  });

  it("reads the day in the config's zone, and groups as the config says", async () => {
    const tokyo = await loaded({
      config: { limit: 5, timeZone: "Asia/Tokyo" },
    });
    expect(tokyo.service.groups.map((group) => group.key)).toEqual([
      "2026-03-05",
      "2026-03-04",
      "2026-03-03",
      "2026-02-27",
    ]);
    const monthly = await loaded({ config: { limit: 5, group: "month" } });
    expect(monthly.service.groups.map((group) => group.key)).toEqual([
      "2026-03",
      "2026-02",
    ]);
  });

  it("grows a group as a further batch joins it", async () => {
    const { service } = await loaded({ config: { limit: 3 } });
    expect(service.groups.at(-1)?.records).toHaveLength(1);
    await service.loadMore();
    expect(service.groups[1]?.records).toHaveLength(2);
    expect(service.groups).toHaveLength(3);
  });

  it("returns the groups it read while the records have not changed", async () => {
    const { service } = await loaded();
    const first = service.groups;
    expect(service.groups).toBe(first);
    await service.loadMore();
    expect(service.groups).not.toBe(first);
  });
});

describe("selection", () => {
  it("holds a key and emits when it changes", () => {
    const { service } = make();
    const heard = vi.fn();
    service.on("selected", heard);
    service.select("e5");
    service.select("e5");
    service.select(null);
    expect(service.selected).toBeNull();
    expect(heard.mock.calls).toEqual([
      [{ id: "log", key: "e5" }],
      [{ id: "log", key: null }],
    ]);
  });
});

describe("the state container", () => {
  it("passes writes through the middleware and emits each change", async () => {
    const { service } = make({
      options: {
        set: { state: { records: (records) => records.slice(0, 1) } },
      },
    });
    const heard = vi.fn();
    service.on("change", heard);
    await service.init();
    expect(shas(service.records)).toEqual(["e5"]);
    expect(heard).toHaveBeenCalledWith({
      field: "initialized",
      before: false,
      after: true,
    });
  });
});

describe("search", () => {
  it("holds the query's clauses and draft in the timeline's container", () => {
    const { service, state } = make({ config: { fields } });
    service.query.setDraft("Author: a");
    service.query.add({ kind: "filter", key: "author", value: "ada" });
    expect(state.draft).toBe("Author: a");
    expect(state.clauses).toEqual([
      { kind: "filter", key: "author", value: "ada" },
    ]);
    expect(service.query.fields).toEqual(fields);
  });

  it("a change to the clauses fetches anew with them, from the first batch, and emits filtered", async () => {
    const { service, fetch } = await loaded({ config: { fields } });
    await service.loadMore();
    const filtered = vi.fn();
    service.on("filtered", filtered);
    service.query.add({ kind: "literal", key: "text", value: "fix" });
    service.query.add({ kind: "filter", key: "author", value: "ada" });
    const filters = [{ key: "author", value: "ada" }];
    expect(fetch).toHaveBeenCalledTimes(4);
    expect(fetch).toHaveBeenLastCalledWith(
      { cursor: null, limit: 2, query: "fix", filters },
      service,
    );
    expect(filtered).toHaveBeenLastCalledWith({
      id: "log",
      query: "fix",
      filters,
    });
  });

  it("says whether a view renders the search", () => {
    expect(make().service.searchable).toBe(false);
    expect(make({ config: { fields } }).service.searchable).toBe(true);
    expect(
      make({ config: { fields, searchable: false } }).service.searchable,
    ).toBe(false);
  });
});

describe("views", () => {
  const saved = {
    clauses: [{ kind: "filter" as const, key: "author", value: "ada" }],
    interval: 0,
  };

  it("snapshots the clauses and the interval", () => {
    const { service } = make({ config: { fields } });
    expect(service.snapshot()).toEqual({ clauses: [], interval: 0 });
    service.query.add(saved.clauses[0]!);
    expect(service.snapshot()).toEqual(saved);
  });

  it("restores a snapshot in one fetch, and emits", async () => {
    const { service, fetch } = await loaded({ config: { fields } });
    const filtered = vi.fn();
    const restored = vi.fn();
    service.on("filtered", filtered);
    service.on("restored", restored);
    service.restore(saved);
    expect(service.snapshot()).toEqual(saved);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenLastCalledWith(
      {
        cursor: null,
        limit: 2,
        query: "",
        filters: [{ key: "author", value: "ada" }],
      },
      service,
    );
    expect(filtered).toHaveBeenCalledTimes(1);
    expect(restored).toHaveBeenCalledWith({ id: "log", snapshot: saved });
  });

  it("fetches nothing before init", () => {
    const { service, fetch } = make({ config: { fields } });
    service.restore(saved);
    expect(service.snapshot()).toEqual(saved);
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("sync", () => {
  const AT = NOW.toISOString();
  const fresh = commit("g7", "2026-03-05T08:00:00Z");

  type Refresh = NonNullable<Actions<Commit>["refresh"]>;

  const synced = async (
    refresh: Refresh,
    config: Partial<Config<Commit>> = {},
  ) => {
    const spy = vi.fn(refresh);
    const made = await loaded({ config, actions: { refresh: spy } });
    const loadedEvent = vi.fn();
    made.service.on("loaded", loadedEvent);
    return { ...made, refresh: spy, loaded: loadedEvent };
  };

  it("has no sync without a refresh", () => {
    expect(make().service.sync).toBeUndefined();
  });

  it("has a sync over the container with one, on the config's interval", async () => {
    const { service, state } = await synced(() => false, {
      sync: { intervals: [5_000], interval: 5_000 },
    });
    expect(service.sync?.id).toBe("log-sync");
    expect(service.sync?.interval).toBe(5_000);
    service.sync?.setInterval(0);
    expect(state.interval).toBe(0);
  });

  it("marks a fetch with the timeline's clock, or with the mark the result names", async () => {
    const { service, state } = await synced(() => false);
    expect(state.since).toBe(AT);
    service.load({ data: [], since: "2026-03-01T00:00:00.000Z" });
    expect(state.since).toBe("2026-03-01T00:00:00.000Z");
  });

  it("polls the refresh with the first batch's params and the mark", async () => {
    const { service, refresh } = await synced(() => false);
    await service.loadMore();
    await service.sync?.poll();
    expect(refresh).toHaveBeenCalledWith(
      { cursor: null, limit: 2, query: "", filters: [], since: AT },
      service,
    );
  });

  it("keeps the records where the refresh answers nothing", async () => {
    const { service, loaded: heard } = await synced(() => false);
    await service.sync?.poll();
    expect(shas(service.records)).toEqual(["e5", "d4"]);
    expect(heard).not.toHaveBeenCalled();
  });

  it("lays what a refresh brings into the records held, and keeps what was loaded further down", async () => {
    const amended = { ...commits[2]!, message: "Amended" };
    const { service, loaded: heard } = await synced(() => ({
      data: [fresh, amended],
      cursor: null,
    }));
    await service.loadMore();
    await service.sync?.poll();
    expect(shas(service.records)).toEqual(["g7", "e5", "d4", "c3", "b2"]);
    expect(service.record("c3")?.message).toBe("Amended");
    expect(service.more).toBe(true);
    expect(service.loading).toBe(false);
    expect(heard).toHaveBeenCalledWith({ id: "log", count: 5, more: true });
  });

  it("fetches the first batch again where the refresh says so, and lays it in", async () => {
    const { service, fetch } = await synced(() => true);
    await service.loadMore();
    fetch.mockImplementationOnce(async () => ({
      data: [fresh, commits[0]!],
      cursor: "2",
    }));
    await service.sync?.poll();
    expect(shas(service.records)).toEqual(["g7", "e5", "d4", "c3", "b2"]);
    await service.loadMore();
    expect(fetch).toHaveBeenLastCalledWith(
      { cursor: "4", limit: 2, query: "", filters: [] },
      service,
    );
  });

  it("replaces the records by a fetch after a refresh, and after a fetch that failed", async () => {
    const { service, fetch } = await synced(() => ({ data: [fresh] }));
    fetch.mockImplementationOnce(async () => Promise.reject(new Error("down")));
    await expect(service.fetch()).rejects.toThrow("down");
    await service.sync?.poll();
    expect(shas(service.records)).toEqual(["g7", "e5", "d4"]);
    await service.fetch();
    expect(shas(service.records)).toEqual(["e5", "d4"]);
  });

  it("restores the interval of a snapshot through the sync", async () => {
    const { service } = await synced(() => false, {
      sync: { intervals: [5_000] },
    });
    service.restore({ ...service.snapshot(), interval: 5_000 });
    expect(service.sync?.interval).toBe(5_000);
  });
});
