import { describe, expect, it } from "vitest";
import { createCodeState } from "../src/state";
import { CODE_ORIGIN, CODE_STATE_FIELDS } from "../src/constants";

describe("createCodeState", () => {
  it("starts empty at revision zero with the cursor at the origin and no element", () => {
    expect(createCodeState()).toEqual({
      revision: 0,
      empty: true,
      cursor: { line: 1, column: 1 },
      mounted: false,
    });
  });

  it("each call returns an independent container", () => {
    const a = createCodeState();
    const b = createCodeState();
    a.cursor.line = 4;
    expect(b.cursor).toEqual(CODE_ORIGIN);
    expect(CODE_ORIGIN).toEqual({ line: 1, column: 1 });
  });

  it("CODE_STATE_FIELDS names exactly the container's fields", () => {
    expect(Object.keys(CODE_STATE_FIELDS).sort()).toEqual(
      Object.keys(createCodeState()).sort(),
    );
  });
});
