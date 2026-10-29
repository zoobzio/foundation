import type { IconAlias } from "../types/icon";

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
