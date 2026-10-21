// Gold standard: widget composables. The composable composes store + service
// through the shim's Nuxt seams — tests assert the composition: live reactive
// views over shared keyed state, not re-tested service logic.
import { describe, expect, it, vi } from "vitest";
import { toValue } from "vue";
import { useNuxtApp } from "#imports";
import { defineEntity } from "../../../app/definitions/entity";
import { useDeck } from "../../../app/factories/deck";
import type { Actions } from "../../../app/types/data/deck";
import { fakeRows } from "#test/data/rows";
import type { FakeRow } from "#test/data/rows";

const rows = defineEntity<FakeRow>();

const definition = rows.defineDeck({
  topic: "contacts",
  rowKey: "id",
  dateFields: [{ key: "created", label: "Created" }],
});

const makeWiring = () => ({
  fetch: vi.fn<Actions<FakeRow>["fetch"]>(async () => ({
    data: fakeRows,
    hasMore: true,
  })),
});

describe("useDeck", () => {
  it("yields the widget triple resolving pt into settings", () => {
    const widget = useDeck(
      "d1",
      { ...definition, pt: { pending: { label: "feed" } } },
      makeWiring(),
    );
    expect(widget.component).toBeDefined();
    expect(toValue(widget.settings)).toEqual({ pending: { label: "feed" } });
  });

  it("merges wiring pt over the definition base per key", () => {
    const widget = useDeck(
      "d1",
      {
        ...definition,
        pt: { pending: { label: "base" } },
      },
      { ...makeWiring(), pt: { pending: { label: "override" } } },
    );
    expect(toValue(widget.settings)).toEqual({
      pending: { label: "override" },
    });
  });

  it("builds a deck over fresh store state", () => {
    const deck = useDeck("d1", definition, makeWiring()).service;
    expect(deck.id).toBe("d1");
    expect(deck.items).toEqual([]);
    expect(deck.initialized).toBe(false);
    expect(deck.sortField).toBe("created");
    expect(deck.title).toBe("Recently Created contacts");
  });

  it("init drives the fetch pipeline into the reactive views", async () => {
    const wiring = makeWiring();
    const deck = useDeck("d1", definition, wiring).service;
    await deck.init();
    expect(deck.items).toEqual(fakeRows);
    expect(deck.hasMore).toBe(true);
    expect(deck.initialized).toBe(true);
    expect(wiring.fetch).toHaveBeenCalledOnce();
  });

  it("filter mutations refetch with the updated params", async () => {
    const wiring = makeWiring();
    const deck = useDeck("d1", definition, wiring).service;
    await deck.init();
    deck.setQuery("alice");
    const params = wiring.fetch.mock.calls.at(-1)?.[0];
    expect(params?.query).toBe("alice");
    expect(params?.sortField).toBe("created");
  });

  it("loadMore appends older items behind a before cursor", async () => {
    const wiring = makeWiring();
    const older: FakeRow = {
      id: 4,
      name: "Dana",
      status: "Active",
      created: "2024-12-01",
      amount: 400,
    };
    const deck = useDeck("d1", definition, wiring).service;
    await deck.init();
    wiring.fetch.mockResolvedValueOnce({ data: [older], hasMore: false });
    await deck.loadMore();
    const oldest = fakeRows.at(-1);
    expect(wiring.fetch.mock.calls.at(-1)?.[0]).toMatchObject({
      before: String(oldest?.created),
    });
    expect(deck.items).toEqual([...fakeRows, older]);
    expect(deck.hasMore).toBe(false);
  });

  it("poll stashes newer items as pending until shown", async () => {
    const wiring = makeWiring();
    const newer: FakeRow = {
      id: 5,
      name: "Eve",
      status: "Active",
      created: "2025-04-01",
      amount: 500,
    };
    const deck = useDeck("d1", definition, wiring).service;
    await deck.init();
    wiring.fetch.mockResolvedValueOnce({ data: [newer], hasMore: true });
    await deck.poll();
    const newest = fakeRows.at(0);
    expect(wiring.fetch.mock.calls.at(-1)?.[0]).toMatchObject({
      after: String(newest?.created),
    });
    expect(deck.pendingCount).toBe(1);
    expect(deck.items).toEqual(fakeRows);
    deck.showPending();
    expect(deck.items).toEqual([newer, ...fakeRows]);
    expect(deck.pendingCount).toBe(0);
  });

  it("routes service events onto the Nuxt hook bus", async () => {
    const updated = vi.fn();
    const polled = vi.fn();
    const failed = vi.fn();
    useNuxtApp().hooks.addHooks({
      "deck:updated": updated,
      "deck:polled": polled,
      "deck:failed": failed,
    });
    const wiring = makeWiring();
    const deck = useDeck("d1", definition, wiring).service;
    await deck.init();
    expect(updated).toHaveBeenCalledWith({ id: "d1", count: fakeRows.length });
    wiring.fetch.mockResolvedValueOnce({
      data: fakeRows.slice(0, 1),
      hasMore: true,
    });
    await deck.poll();
    expect(polled).toHaveBeenCalledWith({ id: "d1", count: 1 });
    const cause = new Error("boom");
    wiring.fetch.mockRejectedValueOnce(cause);
    await deck.poll();
    expect(failed).toHaveBeenCalledWith({ id: "d1", cause });
  });

  it("same id shares state across instances", async () => {
    const a = useDeck("d1", definition, makeWiring()).service;
    const b = useDeck("d1", definition, makeWiring()).service;
    await a.init();
    a.setQuery("shared");
    expect(b.query).toBe("shared");
    expect(b.items).toEqual(fakeRows);
  });

  it("different ids stay independent", async () => {
    const a = useDeck("d1", definition, makeWiring()).service;
    const b = useDeck("d2", definition, makeWiring()).service;
    await a.init();
    expect(b.initialized).toBe(false);
    expect(b.items).toEqual([]);
  });
});
