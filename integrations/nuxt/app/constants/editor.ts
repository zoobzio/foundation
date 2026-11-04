import type { IconAlias } from "../types/icon";
import type { AppMessage } from "../types/text";

/**
 * The icon of each editor tool, by the tool's key: the marks, the blocks,
 * and history. A heading tool's key carries its level (`heading-2`), and
 * every level draws the one `heading` icon beside its `H<n>` label. The
 * editor and rich text wrappers draw these in `toolPrepend`.
 */
export const EDITOR_TOOL_ICONS: Readonly<Record<string, IconAlias>> = {
  bold: "bold",
  italic: "italic",
  underline: "underline",
  strike: "strike",
  code: "code",
  heading: "heading",
  bulletList: "bullet-list",
  orderedList: "ordered-list",
  blockquote: "blockquote",
  codeBlock: "code-block",
  horizontalRule: "rule",
  undo: "undo",
  redo: "redo",
};

/**
 * The message of each editor tool's label, by the tool's key: the marks,
 * the blocks, and history. A heading tool is not here: its message takes
 * the level its key carries, which `toolText` reads.
 */
export const EDITOR_TOOL_TEXT: Readonly<Record<string, AppMessage>> = {
  bold: "editor.bold",
  italic: "editor.italic",
  underline: "editor.underline",
  strike: "editor.strike",
  code: "editor.code",
  bulletList: "editor.bulletList",
  orderedList: "editor.orderedList",
  blockquote: "editor.blockquote",
  codeBlock: "editor.codeBlock",
  horizontalRule: "editor.rule",
  undo: "editor.undo",
  redo: "editor.redo",
};
