import { describe, expect, it } from "vitest";
import { EditorState } from "@codemirror/state";
import { historyField, undo } from "@codemirror/commands";
import { cursor, features, same } from "../src/util";
import { lines } from "./data";

/** Whether a state carries the history field. */
const hasHistory = (state: EditorState): boolean =>
  state.field(historyField, false) !== undefined;

describe("features", () => {
  it("adds history and its key bindings when nothing is set", () => {
    const state = EditorState.create({ extensions: features({}) });
    expect(hasHistory(state)).toBe(true);
    expect(features({}).length).toBe(2);
  });

  it("adds nothing when history is off", () => {
    expect(features({ history: false })).toEqual([]);
    const state = EditorState.create({
      extensions: features({ history: false }),
    });
    expect(hasHistory(state)).toBe(false);
    expect(undo({ state, dispatch: () => {} })).toBe(false);
  });

  it("a feature that is on keeps its extensions", () => {
    expect(features({ history: true }).length).toBe(2);
  });
});

describe("cursor", () => {
  it("starts at the origin", () => {
    expect(cursor(EditorState.create({ doc: lines }))).toEqual({
      line: 1,
      column: 1,
    });
  });

  it("counts the line and column from one", () => {
    const state = EditorState.create({
      doc: lines,
      selection: { anchor: 6 }, // "one\ntw|o"
    });
    expect(cursor(state)).toEqual({ line: 2, column: 3 });
  });

  it("follows the head of a range", () => {
    const state = EditorState.create({
      doc: lines,
      selection: { anchor: 0, head: 8 },
    });
    expect(cursor(state)).toEqual({ line: 3, column: 1 });
  });
});

describe("same", () => {
  it("agrees on equal cursors", () => {
    expect(same({ line: 2, column: 3 }, { line: 2, column: 3 })).toBe(true);
  });

  it("differs on a line or a column", () => {
    expect(same({ line: 2, column: 3 }, { line: 3, column: 3 })).toBe(false);
    expect(same({ line: 2, column: 3 }, { line: 2, column: 4 })).toBe(false);
  });
});
