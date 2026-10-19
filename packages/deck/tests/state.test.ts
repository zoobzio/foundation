import { describe, expect, it } from "vitest";
import { createDeckState } from "../src/state";
import { DECK_DEFAULT_MATCH_MODE, DECK_STATE_FIELDS } from "../src/constants";
import { fakeConfig } from "./data";
import type { FakeRow } from "./data";

describe("createDeckState", () => {
  it("initializes every field with its default", () => {
    const state = createDeckState<FakeRow>(fakeConfig);
    expect(state).toEqual({
      items: [],
      pending: [],
      loading: false,
      loadingMore: false,
      hasMore: true,
      initialized: false,
      query: "",
      keywords: "",
      match: DECK_DEFAULT_MATCH_MODE,
      selectedFacets: new Set(),
      facetGroups: [],
      sortField: "created",
    });
  });

  it("sortField defaults to the first declared date field", () => {
    const state = createDeckState<FakeRow>({
      ...fakeConfig,
      dateFields: [{ key: "amount", label: "Billed" }],
    });
    expect(state.sortField).toBe("amount");
  });

  it("sortField falls back to created with no date fields", () => {
    const state = createDeckState<FakeRow>({ ...fakeConfig, dateFields: [] });
    expect(state.sortField).toBe("created");
  });

  it("each call returns an independent container", () => {
    const a = createDeckState<FakeRow>(fakeConfig);
    const b = createDeckState<FakeRow>(fakeConfig);
    a.query = "alice";
    a.selectedFacets.add("status:Active");
    expect(b.query).toBe("");
    expect(b.selectedFacets.size).toBe(0);
  });

  it("DECK_STATE_FIELDS names exactly the container's fields", () => {
    const state = createDeckState<FakeRow>(fakeConfig);
    expect(Object.keys(DECK_STATE_FIELDS).sort()).toEqual(
      Object.keys(state).sort(),
    );
  });
});
