import { describe, expect, it } from "vitest";
import { createBrowserState } from "../src/state";
import {
  BROWSER_DEFAULT_SORT_DIRECTION,
  BROWSER_STATE_FIELDS,
} from "../src/constants";
import type { FakeFile } from "./data";

describe("createBrowserState", () => {
  it("initializes every field with its default", () => {
    const state = createBrowserState<FakeFile>();
    expect(state).toEqual({
      folders: [],
      files: [],
      loading: false,
      initialized: false,
      path: [],
      sortField: null,
      sortDirection: BROWSER_DEFAULT_SORT_DIRECTION,
      selected: new Set(),
      selectedFolders: new Set(),
      clauses: [],
      draft: "",
      suggest: { options: [], status: "idle", more: false },
      interval: 0,
      since: null,
      syncing: false,
    });
  });

  it("starts the sync on the config's interval", () => {
    expect(
      createBrowserState<FakeFile>({ sync: { interval: 30_000 } }).interval,
    ).toBe(30_000);
  });

  it("each call returns an independent container", () => {
    const a = createBrowserState<FakeFile>();
    const b = createBrowserState<FakeFile>();
    a.path = [{ key: "media", label: "Media" }];
    a.selected.add("1");
    expect(b.path).toEqual([]);
    expect(b.selected.size).toBe(0);
  });

  it("BROWSER_STATE_FIELDS names exactly the container's fields", () => {
    const state = createBrowserState<FakeFile>();
    expect(Object.keys(BROWSER_STATE_FIELDS).sort()).toEqual(
      Object.keys(state).sort(),
    );
  });
});
