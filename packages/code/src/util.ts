import type { Config, Cursor } from "./types";
import type { EditorState, Extension } from "@codemirror/state";

import { history, historyKeymap } from "@codemirror/commands";
import { keymap } from "@codemirror/view";

/**
 * The feature set as CodeMirror extensions: a feature that is on, or
 * unset, adds its extensions; one that is off adds nothing. History brings
 * its key bindings with it.
 */
export const features = (config: Config): Extension[] => {
  const extensions: Extension[] = [];
  if (config.history !== false) {
    extensions.push(history(), keymap.of(historyKeymap));
  }
  return extensions;
};

/**
 * Where the selection's head is, as a line and a column counted from one.
 */
export const cursor = (state: EditorState): Cursor => {
  const head = state.selection.main.head;
  const line = state.doc.lineAt(head);
  return { line: line.number, column: head - line.from + 1 };
};

/**
 * Whether two cursors agree.
 */
export const same = (a: Cursor, b: Cursor): boolean =>
  a.line === b.line && a.column === b.column;
