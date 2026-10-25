import { describe, expect, it } from "vitest";
import { createEditorState } from "../src/state";
import { EDITOR_STATE_FIELDS } from "../src/constants";

describe("createEditorState", () => {
  it("starts empty at revision zero with nothing active and no element", () => {
    expect(createEditorState()).toEqual({
      revision: 0,
      empty: true,
      active: {},
      mounted: false,
    });
  });

  it("each call returns an independent container", () => {
    const a = createEditorState();
    const b = createEditorState();
    a.active.bold = true;
    expect(b.active).toEqual({});
  });

  it("EDITOR_STATE_FIELDS names exactly the container's fields", () => {
    expect(Object.keys(EDITOR_STATE_FIELDS).sort()).toEqual(
      Object.keys(createEditorState()).sort(),
    );
  });
});
