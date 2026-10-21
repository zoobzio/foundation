// Gold standard: stores. Exercised through the shim's real useState semantics
// — the contract under test is the keyed shared container, defaults, and
// config-driven initialization, not the proxy plumbing.
import { describe, expect, it } from "vitest";
import { accessDeck } from "../../../app/stores/deck";
import { DECK_DEFAULT_MATCH_MODE } from "../../../app/constants/deck";
import type { FakeRow } from "#test/data/rows";

const config = {
  topic: "contacts",
  rowKey: "id" as const,
  dateFields: [
    { key: "created" as const, label: "Created" },
    { key: "amount" as const, label: "Billed" },
  ],
};

describe("accessDeck", () => {
  it("initializes state with defaults", () => {
    const state = accessDeck<FakeRow>("d1", config);
    expect(state.items).toEqual([]);
    expect(state.pending).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.loadingMore).toBe(false);
    expect(state.hasMore).toBe(true);
    expect(state.initialized).toBe(false);
    expect(state.query).toBe("");
    expect(state.keywords).toBe("");
    expect(state.match).toBe(DECK_DEFAULT_MATCH_MODE);
    expect(state.selectedFacets).toEqual(new Set());
    expect(state.facetGroups).toEqual([]);
  });

  it("sortField defaults to the first declared date field", () => {
    const state = accessDeck<FakeRow>("d1", config);
    expect(state.sortField).toBe("created");
  });

  it("same id shares state across calls", () => {
    const first = accessDeck<FakeRow>("d1", config);
    first.query = "alice";
    const second = accessDeck<FakeRow>("d1", config);
    expect(second).toBe(first);
    expect(second.query).toBe("alice");
  });

  it("different ids get independent state", () => {
    const a = accessDeck<FakeRow>("d1", config);
    const b = accessDeck<FakeRow>("d2", config);
    a.query = "bob";
    expect(b.query).toBe("");
  });
});
