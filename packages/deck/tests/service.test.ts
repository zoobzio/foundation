// Constructor-injected seams — a plain state container, a vi.fn() Actions
// fake, and vi.fn() listeners. Every test drives a state transition and
// asserts both the new state and the side-channel contracts (fetch params,
// events).
import { describe, expect, it, vi } from "vitest";
import { DeckService } from "../src/service";
import { createDeckState } from "../src/state";
import { DECK_PAGE_SIZE, DECK_POLL_INTERVAL } from "../src/constants";
import type {
  Change,
  Config,
  DataDeckFetchResult,
  Options,
  State,
} from "../src/types";
import { fakeConfig, fakeFacets, fakeRows } from "./data";
import type { FakeRow } from "./data";

const older: FakeRow = {
  id: 0,
  name: "Dana",
  status: "Active",
  created: "2024-12-01",
  amount: 50,
};

const newer: FakeRow = {
  id: 4,
  name: "Eve",
  status: "Active",
  created: "2025-04-01",
  amount: 400,
};

const makeActions = (rows: FakeRow[] = fakeRows) => ({
  fetch: vi.fn(async (): Promise<DataDeckFetchResult<FakeRow>> => ({
    data: rows,
    hasMore: true,
  })),
});

const makeService = (
  overrides: {
    state?: State<FakeRow>;
    actions?: ReturnType<typeof makeActions>;
    config?: Partial<Config<FakeRow>>;
    options?: Options<FakeRow>;
  } = {},
) => {
  const config = { ...fakeConfig, ...overrides.config };
  const state = overrides.state ?? createDeckState<FakeRow>(config);
  const actions = overrides.actions ?? makeActions();
  const service = new DeckService<FakeRow>(
    "test-deck",
    config,
    state,
    actions,
    overrides.options,
  );
  const updated = vi.fn();
  const polled = vi.fn();
  const failed = vi.fn();
  service.on("updated", updated);
  service.on("polled", polled);
  service.on("failed", failed);
  return { service, state, actions, updated, polled, failed };
};

const baseParams = {
  limit: DECK_PAGE_SIZE,
  sortField: "created",
  query: "",
  keywords: "",
  match: "all",
  facets: new Set(),
};

describe("config", () => {
  it("exposes the config surface with defaults", () => {
    const { service } = makeService();
    expect(service.topic).toBe("contacts");
    expect(service.rowKey).toBe("id");
    expect(service.dateFields).toBe(fakeConfig.dateFields);
    expect(service.pollInterval).toBe(DECK_POLL_INTERVAL);
    expect(service.pageSize).toBe(DECK_PAGE_SIZE);
  });

  it("config overrides the poll interval and page size", () => {
    const { service } = makeService({
      config: { pollInterval: 5000, pageSize: 10 },
    });
    expect(service.pollInterval).toBe(5000);
    expect(service.pageSize).toBe(10);
  });
});

describe("fetch", () => {
  it("passes the committed params and applies the result", async () => {
    const { service, state, actions } = makeService();
    state.query = "alice";
    state.keywords = "vip";
    state.match = "any";
    state.selectedFacets = new Set(["status:Active"]);

    await service.fetch();

    expect(actions.fetch).toHaveBeenCalledWith(
      {
        ...baseParams,
        query: "alice",
        keywords: "vip",
        match: "any",
        facets: new Set(["status:Active"]),
      },
      service,
    );
    expect(service.items).toEqual(fakeRows);
    expect(service.hasMore).toBe(true);
  });

  it("clears the pending buffer and applies facets when returned", async () => {
    const { service, state, actions } = makeService();
    state.pending = [newer];
    actions.fetch.mockResolvedValueOnce({
      data: fakeRows,
      hasMore: false,
      facets: fakeFacets,
    });
    await service.fetch();
    expect(service.pending).toEqual([]);
    expect(service.facetGroups).toEqual(fakeFacets);
    expect(service.hasMore).toBe(false);
  });

  it("keeps the facet groups when the result omits them", async () => {
    const { service, state } = makeService();
    state.facetGroups = fakeFacets;
    await service.fetch();
    expect(service.facetGroups).toEqual(fakeFacets);
  });

  it("holds loading during flight and clears it after", async () => {
    const box: { resolve?: (r: DataDeckFetchResult<FakeRow>) => void } = {};
    const actions = makeActions();
    actions.fetch.mockImplementationOnce(
      () =>
        new Promise<DataDeckFetchResult<FakeRow>>((res) => {
          box.resolve = res;
        }),
    );
    const { service } = makeService({ actions });

    const flight = service.fetch();
    expect(service.loading).toBe(true);
    box.resolve?.({ data: [], hasMore: false });
    await flight;
    expect(service.loading).toBe(false);
  });

  it("clears loading and still emits when the action throws", async () => {
    const actions = makeActions();
    actions.fetch.mockRejectedValueOnce(new Error("boom"));
    const { service, updated } = makeService({ actions });

    await expect(service.fetch()).rejects.toThrow("boom");
    expect(service.loading).toBe(false);
    expect(updated).toHaveBeenCalledWith({ id: "test-deck", count: 0 });
  });

  it("emits updated with the feed length", async () => {
    const { service, updated } = makeService();
    await service.fetch();
    expect(updated).toHaveBeenCalledWith({
      id: "test-deck",
      count: fakeRows.length,
    });
  });
});

describe("loadMore", () => {
  it("appends older items behind a before cursor on the sort field", async () => {
    const { service, actions } = makeService();
    await service.fetch();
    actions.fetch.mockResolvedValueOnce({ data: [older], hasMore: false });
    await service.loadMore();
    expect(actions.fetch).toHaveBeenLastCalledWith(
      { ...baseParams, before: fakeRows.at(-1)?.created },
      service,
    );
    expect(service.items).toEqual([...fakeRows, older]);
    expect(service.hasMore).toBe(false);
  });

  it("cursors on the active sort field", async () => {
    const { service, state, actions } = makeService();
    state.sortField = "amount";
    await service.fetch();
    await service.loadMore();
    expect(actions.fetch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        sortField: "amount",
        before: String(fakeRows.at(-1)?.amount),
      }),
      service,
    );
  });

  it("applies facets when returned", async () => {
    const { service, actions } = makeService();
    await service.fetch();
    actions.fetch.mockResolvedValueOnce({
      data: [],
      hasMore: false,
      facets: fakeFacets,
    });
    await service.loadMore();
    expect(service.facetGroups).toEqual(fakeFacets);
  });

  it("holds loadingMore during flight and clears it after a failure", async () => {
    const { service, actions } = makeService();
    await service.fetch();
    actions.fetch.mockRejectedValueOnce(new Error("boom"));
    await expect(service.loadMore()).rejects.toThrow("boom");
    expect(service.loadingMore).toBe(false);
  });

  it("is a no-op with no items, no more, or a flight in progress", async () => {
    const { service, state, actions } = makeService();
    await service.loadMore();
    expect(actions.fetch).not.toHaveBeenCalled();

    await service.fetch();
    state.hasMore = false;
    await service.loadMore();
    expect(actions.fetch).toHaveBeenCalledOnce();

    state.hasMore = true;
    state.loadingMore = true;
    await service.loadMore();
    expect(actions.fetch).toHaveBeenCalledOnce();
  });

  it("is a no-op when the sort field is not a declared date field", async () => {
    const { service, state, actions } = makeService();
    await service.fetch();
    state.sortField = "ghost";
    await service.loadMore();
    expect(actions.fetch).toHaveBeenCalledOnce();
  });
});

describe("poll", () => {
  it("stashes newer items as pending behind an after cursor and emits polled", async () => {
    const { service, actions, polled } = makeService();
    await service.fetch();
    actions.fetch.mockResolvedValueOnce({ data: [newer], hasMore: true });
    await service.poll();
    expect(actions.fetch).toHaveBeenLastCalledWith(
      { ...baseParams, after: fakeRows.at(0)?.created },
      service,
    );
    expect(service.pending).toEqual([newer]);
    expect(service.pendingCount).toBe(1);
    expect(service.items).toEqual(fakeRows);
    expect(polled).toHaveBeenCalledWith({ id: "test-deck", count: 1 });
  });

  it("prepends to the pending buffer across polls", async () => {
    const { service, actions } = makeService();
    await service.fetch();
    actions.fetch.mockResolvedValueOnce({ data: [older], hasMore: true });
    await service.poll();
    actions.fetch.mockResolvedValueOnce({ data: [newer], hasMore: true });
    await service.poll();
    expect(service.pending).toEqual([newer, older]);
  });

  it("stays quiet with no new items and still applies facets", async () => {
    const { service, actions, polled } = makeService();
    await service.fetch();
    actions.fetch.mockResolvedValueOnce({
      data: [],
      hasMore: true,
      facets: fakeFacets,
    });
    await service.poll();
    expect(service.pending).toEqual([]);
    expect(service.facetGroups).toEqual(fakeFacets);
    expect(polled).not.toHaveBeenCalled();
  });

  it("reports a failed poll as failed instead of throwing", async () => {
    const { service, actions, polled, failed } = makeService();
    await service.fetch();
    const cause = new Error("boom");
    actions.fetch.mockRejectedValueOnce(cause);
    await expect(service.poll()).resolves.toBeUndefined();
    expect(service.pending).toEqual([]);
    expect(polled).not.toHaveBeenCalled();
    expect(failed).toHaveBeenCalledWith({ id: "test-deck", cause });
  });

  it("is a no-op with no items", async () => {
    const { service, actions } = makeService();
    await service.poll();
    expect(actions.fetch).not.toHaveBeenCalled();
  });

  it("showPending moves the buffer to the front of the feed", async () => {
    const { service, actions } = makeService();
    await service.fetch();
    actions.fetch.mockResolvedValueOnce({ data: [newer], hasMore: true });
    await service.poll();
    service.showPending();
    expect(service.items).toEqual([newer, ...fakeRows]);
    expect(service.pendingCount).toBe(0);
  });
});

describe("search", () => {
  it("setSortField refetches on a declared date field", () => {
    const { service, actions } = makeService();
    service.setSortField("amount");
    expect(service.sortField).toBe("amount");
    expect(actions.fetch).toHaveBeenCalledOnce();
  });

  it("setSortField ignores an undeclared field", () => {
    const { service, actions } = makeService();
    service.setSortField("ghost");
    expect(service.sortField).toBe("created");
    expect(actions.fetch).not.toHaveBeenCalled();
  });

  it("setQuery, setKeywords, setMatch, setFacets commit and refetch", () => {
    const { service, actions } = makeService();
    service.setQuery("alice");
    service.setKeywords("vip");
    service.setMatch("any");
    service.setFacets(new Set(["status:Active"]));
    expect(service.query).toBe("alice");
    expect(service.keywords).toBe("vip");
    expect(service.match).toBe("any");
    expect(service.selectedFacets).toEqual(new Set(["status:Active"]));
    expect(actions.fetch).toHaveBeenCalledTimes(4);
    expect(actions.fetch).toHaveBeenLastCalledWith(
      {
        ...baseParams,
        query: "alice",
        keywords: "vip",
        match: "any",
        facets: new Set(["status:Active"]),
      },
      service,
    );
  });

  it("writable accessors route through the mutators", () => {
    const { service, actions } = makeService();
    service.query = "alice";
    service.keywords = "vip";
    service.match = "any";
    service.selectedFacets = new Set(["status:Active"]);
    service.sortField = "amount";
    expect(actions.fetch).toHaveBeenCalledTimes(5);
    expect(service.sortField).toBe("amount");
  });
});

describe("title", () => {
  it("uses the declared label of the sort field", () => {
    const { service } = makeService();
    expect(service.title).toBe("Recently Created contacts");
    service.setSortField("amount");
    expect(service.title).toBe("Recently Billed contacts");
  });

  it("falls back to the known labels, then capitalizes", () => {
    const { service, state } = makeService();
    state.sortField = "updated";
    expect(service.title).toBe("Recently Updated contacts");
    state.sortField = "shipped";
    expect(service.title).toBe("Recently Shipped contacts");
  });
});

describe("middleware", () => {
  it("get middleware shapes every read of its field", () => {
    const { service, state } = makeService({
      options: { get: { state: { query: (query) => query.toUpperCase() } } },
    });
    state.query = "alice";
    expect(service.query).toBe("ALICE");
    expect(state.query).toBe("alice");
  });

  it("set middleware shapes the stored value", () => {
    const { service, state } = makeService({
      options: { set: { state: { query: (query) => query.trim() } } },
    });
    service.setQuery("  alice  ");
    expect(state.query).toBe("alice");
    expect(service.query).toBe("alice");
  });

  it("a missing slot passes the value on", () => {
    const { service, state } = makeService({ options: { get: {}, set: {} } });
    service.setKeywords("vip");
    expect(state.keywords).toBe("vip");
    expect(service.keywords).toBe("vip");
  });
});

describe("events", () => {
  it("emits change for every write, after the set middleware", () => {
    const changes: Change<FakeRow>[] = [];
    const { service } = makeService({
      options: { set: { state: { query: (query) => query.trim() } } },
    });
    service.on("change", (change) => changes.push(change));
    service.setQuery(" alice ");
    expect(changes).toEqual([
      { field: "query", before: "", after: "alice" },
      { field: "loading", before: false, after: true },
    ]);
  });

  it("change narrows on field", () => {
    const { service } = makeService();
    const seen: string[] = [];
    service.on("change", (change) => {
      if (change.field === "sortField") seen.push(change.after);
    });
    service.setSortField("amount");
    expect(seen).toEqual(["amount"]);
  });

  it("calls listeners in subscription order and unsubscribes", async () => {
    const { service } = makeService();
    const order: string[] = [];
    const off = service.on("updated", () => order.push("a"));
    service.on("updated", () => order.push("b"));
    await service.fetch();
    off();
    await service.fetch();
    expect(order).toEqual(["a", "b", "b"]);
  });

  it("a listener can unsubscribe itself during the call", async () => {
    const { service } = makeService();
    const calls = vi.fn();
    const off = service.on("updated", () => {
      calls();
      off();
    });
    await service.fetch();
    await service.fetch();
    expect(calls).toHaveBeenCalledOnce();
  });

  it("skips the change object when nothing listens", () => {
    const { service, state } = makeService();
    service.showPending();
    expect(state.pending).toEqual([]);
  });
});

describe("init", () => {
  it("fetches once and is idempotent", async () => {
    const { service, actions } = makeService();
    await service.init();
    await service.init();
    expect(actions.fetch).toHaveBeenCalledOnce();
    expect(service.initialized).toBe(true);
  });
});
