// Gold standard: stores. Exercised through the shim's real useState semantics
// — the contract under test is keyed shared state, defaults, and config-driven
// initialization, not the ref plumbing.
import { describe, expect, it } from "vitest";
import { accessDeck } from "../../../app/stores/deck";
import { DECK_DEFAULT_MATCH_MODE } from "../../../app/constants/deck";
import type { FakeRow } from "#test/data/table";

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
    expect(state.items.value).toEqual([]);
    expect(state.pending.value).toEqual([]);
    expect(state.loading.value).toBe(false);
    expect(state.loadingMore.value).toBe(false);
    expect(state.hasMore.value).toBe(true);
    expect(state.initialized.value).toBe(false);
    expect(state.query.value).toBe("");
    expect(state.keywords.value).toBe("");
    expect(state.match.value).toBe(DECK_DEFAULT_MATCH_MODE);
    expect(state.selectedFacets.value).toEqual(new Set());
    expect(state.facetGroups.value).toEqual([]);
  });

  it("sortField defaults to the first declared date field", () => {
    const state = accessDeck<FakeRow>("d1", config);
    expect(state.sortField.value).toBe("created");
  });

  it("same id shares state across calls", () => {
    const first = accessDeck<FakeRow>("d1", config);
    first.query.value = "alice";
    const second = accessDeck<FakeRow>("d1", config);
    expect(second.query).toBe(first.query);
    expect(second.query.value).toBe("alice");
  });

  it("different ids get independent state", () => {
    const a = accessDeck<FakeRow>("d1", config);
    const b = accessDeck<FakeRow>("d2", config);
    a.query.value = "bob";
    expect(b.query.value).toBe("");
  });
});
