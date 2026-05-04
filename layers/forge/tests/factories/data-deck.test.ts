import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { nextTick } from "vue";
import { createDeck } from "../../app/factories/data-deck";
import type { DataDeckConfig, DataDeckFetchResult } from "../../app/types/data-deck";

interface TestRow {
  id: number;
  title: string;
  status: string;
  created: string;
  updated: string;
}

const fakeItems: TestRow[] = [
  { id: 1, title: "Doc A", status: "Active", created: "2025-03-10T00:00:00Z", updated: "2025-03-15T00:00:00Z" },
  { id: 2, title: "Doc B", status: "Pending", created: "2025-03-09T00:00:00Z", updated: "2025-03-14T00:00:00Z" },
  { id: 3, title: "Doc C", status: "Active", created: "2025-03-08T00:00:00Z", updated: "2025-03-13T00:00:00Z" },
];

const fakeFetch = vi.fn<[], Promise<DataDeckFetchResult<TestRow>>>(async () => ({
  data: fakeItems,
  hasMore: true,
}));

const config: DataDeckConfig<TestRow> = {
  topic: "Document",
  rowKey: "id",
  dateFields: [
    { key: "created", label: "Created" },
    { key: "updated", label: "Updated" },
  ],
  pollInterval: 5000,
  pageSize: 10,
  fetch: fakeFetch,
};

const makeDeck = (id = "test") => createDeck<TestRow>(id, config)();

describe("createDeck", () => {
  beforeEach(() => {
    fakeFetch.mockClear();
  });

  describe("defaults", () => {
    it("initializes with schema defaults", () => {
      const deck = makeDeck();
      expect(deck.sortField.value).toBe("created");
      expect(deck.query.value).toBe("");
      expect(deck.keywords.value).toBe("");
      expect(deck.match.value).toBe("all");
      expect(deck.items.value).toEqual([]);
      expect(deck.pending.value).toEqual([]);
    });

    it("initializes with correct static config", () => {
      const deck = makeDeck("static-test");
      expect(deck.topic).toBe("Document");
      expect(deck.rowKey).toBe("id");
      expect(deck.dateFields).toHaveLength(2);
      expect(deck.pollInterval).toBe(5000);
    });

    it("computes title from sort field and topic", () => {
      const deck = makeDeck("title-test");
      expect(deck.title.value).toBe("Recently Created Document");
    });

    it("initializes canvas as not initialized", () => {
      const deck = makeDeck("init-state-test");
      expect(deck.initialized.value).toBe(false);
    });
  });

  describe("state", () => {
    it("title updates when sort field changes", () => {
      const deck = makeDeck("title-change-test");
      deck.sortField.value = "updated";
      expect(deck.title.value).toBe("Recently Updated Document");
    });

    it("pendingCount reflects pending array length", () => {
      const deck = makeDeck("pending-count-test");
      expect(deck.pendingCount.value).toBe(0);
    });

    it("hasMore defaults to true", () => {
      const deck = makeDeck("hasmore-test");
      expect(deck.hasMore.value).toBe(true);
    });
  });

  describe("actions", () => {
    it("init calls fetch and sets initialized", async () => {
      const deck = makeDeck("init-test");
      expect(deck.initialized.value).toBe(false);
      await deck.init();
      expect(deck.initialized.value).toBe(true);
      expect(fakeFetch).toHaveBeenCalledOnce();
      expect(deck.items.value).toEqual(fakeItems);
    });

    it("init is idempotent", async () => {
      const deck = makeDeck("init-idempotent-test");
      await deck.init();
      await deck.init();
      expect(fakeFetch).toHaveBeenCalledOnce();
    });

    it("fetch replaces items and clears pending", async () => {
      const deck = makeDeck("fetch-test");
      deck.pending.value = [fakeItems[0]!];
      await deck.fetch();
      expect(deck.items.value).toEqual(fakeItems);
      expect(deck.pending.value).toEqual([]);
    });

    it("fetch passes correct base params", async () => {
      const deck = makeDeck("fetch-params-test");
      deck.query.value = "hello";
      deck.sortField.value = "updated";
      await deck.fetch();
      expect(fakeFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          query: "hello",
          sortField: "updated",
          limit: 10,
        }),
      );
    });

    it("loadMore appends older items", async () => {
      const deck = makeDeck("loadmore-test");
      await deck.init();
      fakeFetch.mockClear();
      const olderItems: TestRow[] = [
        { id: 4, title: "Doc D", status: "Active", created: "2025-03-07T00:00:00Z", updated: "2025-03-12T00:00:00Z" },
      ];
      fakeFetch.mockResolvedValueOnce({ data: olderItems, hasMore: false });
      await deck.loadMore();
      expect(deck.items.value).toHaveLength(4);
      expect(deck.items.value[3]).toEqual(olderItems[0]);
      expect(deck.hasMore.value).toBe(false);
    });

    it("loadMore passes before cursor", async () => {
      const deck = makeDeck("loadmore-cursor-test");
      await deck.init();
      fakeFetch.mockClear();
      fakeFetch.mockResolvedValueOnce({ data: [], hasMore: false });
      await deck.loadMore();
      expect(fakeFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          before: "2025-03-08T00:00:00Z",
        }),
      );
    });

    it("loadMore does nothing when hasMore is false", async () => {
      const deck = makeDeck("loadmore-nomore-test");
      await deck.init();
      deck.hasMore.value = false;
      fakeFetch.mockClear();
      await deck.loadMore();
      expect(fakeFetch).not.toHaveBeenCalled();
    });

    it("showPending prepends pending to items", async () => {
      const deck = makeDeck("showpending-test");
      await deck.init();
      const newItem: TestRow = { id: 0, title: "New", status: "Active", created: "2025-03-11T00:00:00Z", updated: "2025-03-16T00:00:00Z" };
      deck.pending.value = [newItem];
      deck.showPending();
      expect(deck.items.value[0]).toEqual(newItem);
      expect(deck.items.value).toHaveLength(4);
      expect(deck.pending.value).toEqual([]);
    });

    it("setSortField updates field and refetches", async () => {
      const deck = makeDeck("setsort-test");
      deck.setSortField("updated");
      await nextTick();
      expect(deck.sortField.value).toBe("updated");
      expect(fakeFetch).toHaveBeenCalled();
    });

    it("setSortField ignores invalid fields", () => {
      const deck = makeDeck("setsort-invalid-test");
      deck.setSortField("nonexistent");
      expect(deck.sortField.value).toBe("created");
    });

    it("fetch updates facetGroups when returned", async () => {
      const facetFetch = vi.fn(async () => ({
        data: fakeItems,
        hasMore: true,
        facets: [{ key: "status", label: "Status", items: [{ value: "Active", label: "Active", count: 2 }] }],
      }));
      const facetConfig: DataDeckConfig<TestRow> = { ...config, fetch: facetFetch };
      const deck = createDeck<TestRow>("facet-test", facetConfig)();
      await deck.fetch();
      expect(deck.facetGroups.value).toHaveLength(1);
      expect(deck.facetGroups.value[0]?.key).toBe("status");
    });
  });

  describe("polling", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("startPolling sets up an interval", async () => {
      const deck = makeDeck("poll-start-test");
      await deck.init();
      fakeFetch.mockClear();
      deck.startPolling();
      expect(fakeFetch).not.toHaveBeenCalled();
      await vi.advanceTimersByTimeAsync(5000);
      expect(fakeFetch).toHaveBeenCalledOnce();
      deck.stopPolling();
    });

    it("stopPolling clears the interval", async () => {
      const deck = makeDeck("poll-stop-test");
      await deck.init();
      fakeFetch.mockClear();
      deck.startPolling();
      deck.stopPolling();
      await vi.advanceTimersByTimeAsync(10000);
      expect(fakeFetch).not.toHaveBeenCalled();
    });

    it("startPolling is idempotent — calling twice does not create duplicate timers", async () => {
      const deck = makeDeck("poll-idempotent-test");
      await deck.init();
      fakeFetch.mockClear();
      deck.startPolling();
      deck.startPolling();
      await vi.advanceTimersByTimeAsync(5000);
      expect(fakeFetch).toHaveBeenCalledTimes(1);
      deck.stopPolling();
    });

    it("poll puts new items into pending", async () => {
      const deck = makeDeck("poll-pending-test");
      await deck.init();
      fakeFetch.mockClear();
      const newItem: TestRow = { id: 99, title: "New Poll", status: "Active", created: "2025-03-12T00:00:00Z", updated: "2025-03-17T00:00:00Z" };
      fakeFetch.mockResolvedValueOnce({ data: [newItem], hasMore: true });
      deck.startPolling();
      await vi.advanceTimersByTimeAsync(5000);
      expect(deck.pending.value).toContainEqual(newItem);
      deck.stopPolling();
    });

    it("poll updates facetGroups when facets are returned", async () => {
      const deck = makeDeck("poll-facets-test");
      await deck.init();
      fakeFetch.mockClear();
      fakeFetch.mockResolvedValueOnce({
        data: [{ id: 99, title: "New", status: "Active", created: "2025-03-12T00:00:00Z", updated: "2025-03-17T00:00:00Z" }],
        hasMore: true,
        facets: [{ key: "status", label: "Status", items: [{ value: "Active", label: "Active", count: 5 }] }],
      });
      deck.startPolling();
      await vi.advanceTimersByTimeAsync(5000);
      expect(deck.facetGroups.value).toHaveLength(1);
      expect(deck.facetGroups.value[0]?.key).toBe("status");
      deck.stopPolling();
    });

    it("showPending moves pending items to main items list", async () => {
      const deck = makeDeck("poll-showpending-test");
      await deck.init();
      const newItem: TestRow = { id: 99, title: "Pending", status: "Active", created: "2025-03-12T00:00:00Z", updated: "2025-03-17T00:00:00Z" };
      deck.pending.value = [newItem];
      deck.showPending();
      expect(deck.items.value[0]).toEqual(newItem);
      expect(deck.items.value).toHaveLength(4);
      expect(deck.pending.value).toEqual([]);
    });
  });

  describe("persistence", () => {
    it("getSnapshot captures current state", () => {
      const deck = makeDeck("snapshot-get-test");
      deck.sortField.value = "updated";
      deck.query.value = "test";
      const snap = deck.getSnapshot();
      expect(snap.sortField).toBe("updated");
      expect(snap.query).toBe("test");
    });

    it("restoreSnapshot applies state and fetches", async () => {
      const deck = makeDeck("snapshot-restore-test");
      deck.restoreSnapshot({
        sortField: "updated",
        query: "restored",
        keywords: "+foo",
        match: "any",
        selectedFacets: ["status:Active"],
      });
      await nextTick();
      expect(deck.sortField.value).toBe("updated");
      expect(deck.query.value).toBe("restored");
      expect(deck.keywords.value).toBe("+foo");
      expect(deck.match.value).toBe("any");
      expect(deck.selectedFacets.value.has("status:Active")).toBe(true);
      expect(fakeFetch).toHaveBeenCalled();
    });

    it("round-trips through snapshot", async () => {
      const deck = makeDeck("snapshot-roundtrip-test");
      deck.sortField.value = "updated";
      deck.query.value = "hello";
      const snap = deck.getSnapshot();

      deck.sortField.value = "created";
      deck.query.value = "";
      deck.restoreSnapshot(snap);
      await nextTick();

      expect(deck.sortField.value).toBe("updated");
      expect(deck.query.value).toBe("hello");
    });
  });
});
