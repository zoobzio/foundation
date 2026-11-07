import type { IconAlias } from "../types/icon";
import type { AppMessage } from "../types/text";

/**
 * The icon of each editor tool, by the tool's key: the marks, the blocks,
 * and history. The headings have none: they are the entries of the block
 * type dropdown, read by name. The editor and rich text wrappers draw
 * these as each button's content, in place of the label text.
 */
export const EDITOR_TOOL_ICONS: Readonly<Record<string, IconAlias>> = {
  bold: "bold",
  italic: "italic",
  underline: "underline",
  strike: "strike",
  code: "code",
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
 * the blocks, and history, and `paragraph`, the block type dropdown's
 * entry that is no tool. A heading tool is not here: its message takes
 * the level its key carries, which `toolText` reads.
 */
export const EDITOR_TOOL_TEXT: Readonly<Record<string, AppMessage>> = {
  paragraph: "editor.paragraph",
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
