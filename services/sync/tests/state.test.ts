import { describe, expect, it } from "vitest";
import { createSyncState } from "../src/state";
import { SYNC_STATE_FIELDS } from "../src/constants";

describe("createSyncState", () => {
  it("initializes every field with its default", () => {
    expect(createSyncState()).toEqual({
      interval: 0,
      since: null,
      syncing: false,
    });
  });

  it("starts on the config's interval", () => {
    expect(createSyncState({ interval: 30_000 }).interval).toBe(30_000);
  });

  it("SYNC_STATE_FIELDS names exactly the container's fields", () => {
    expect(Object.keys(SYNC_STATE_FIELDS).sort()).toEqual(
      Object.keys(createSyncState()).sort(),
    );
  });
});
