import type { EditorEmits } from "../types/components/editor";
import type { Level } from "@zoobzio/editor";

/** The service events the editor relays as emits. Each is a declared emit. */
export const EDITOR_EVENTS = [
  "loaded",
  "updated",
  "mounted",
  "unmounted",
] as const satisfies readonly (keyof EditorEmits)[];

/** The heading levels the toolbar offers when the config names none. */
export const EDITOR_HEADING_LEVELS: readonly Level[] = [1, 2, 3, 4, 5, 6];

/** The marks the toolbar offers, in order, each with its label. */
export const EDITOR_MARKS: readonly (readonly [name: string, label: string])[] =
  [
    ["bold", "Bold"],
    ["italic", "Italic"],
    ["underline", "Underline"],
    ["strike", "Strike"],
    ["code", "Code"],
  ];

export const EDITOR_HEADING_LABEL = "H";
export const EDITOR_BULLET_LIST_LABEL = "Bullet list";
export const EDITOR_ORDERED_LIST_LABEL = "Ordered list";
export const EDITOR_BLOCKQUOTE_LABEL = "Quote";
export const EDITOR_CODE_BLOCK_LABEL = "Code block";
export const EDITOR_RULE_LABEL = "Rule";
export const EDITOR_UNDO_LABEL = "Undo";
export const EDITOR_REDO_LABEL = "Redo";
