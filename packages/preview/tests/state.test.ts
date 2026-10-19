import { describe, expect, it } from "vitest";
import { createPreviewState } from "../src/state";
import { PREVIEW_STATE_FIELDS } from "../src/constants";
import type { FakeRow } from "./data";

describe("createPreviewState", () => {
  it("initializes every field with its default", () => {
    const state = createPreviewState<FakeRow>();
    expect(state).toEqual({ initialized: false, loading: false, data: null });
  });

  it("each call returns an independent container", () => {
    const a = createPreviewState<FakeRow>();
    const b = createPreviewState<FakeRow>();
    a.loading = true;
    expect(b.loading).toBe(false);
  });

  it("PREVIEW_STATE_FIELDS names exactly the container's fields", () => {
    const state = createPreviewState<FakeRow>();
    expect(Object.keys(PREVIEW_STATE_FIELDS).sort()).toEqual(
      Object.keys(state).sort(),
    );
  });
});
