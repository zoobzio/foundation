import type { IconAlias } from "../types/icon";
import type { AppMessage } from "../types/text";

import { EDITOR_TOOL_ICONS, EDITOR_TOOL_TEXT } from "../constants/editor";

/**
 * The icon of an editor tool, by its key. A heading tool's key carries its
 * level (`heading-2`), and every level draws the one `heading` icon.
 */
export const toolIcon = (key: string): IconAlias | undefined =>
  EDITOR_TOOL_ICONS[/^heading-\d+$/.test(key) ? "heading" : key];

/**
 * The text of an editor tool, by its key, as a message of the contract. A
 * heading tool's key carries its level (`heading-2`), which the one
 * `editor.heading` message takes as its value. A tool the layer does not
 * name — one an app adds — has none, and its own label stands.
 */
export const toolText = (key: string): AppMessage | undefined => {
  const heading = /^heading-(\d+)$/.exec(key);
  if (heading) return ["editor.heading", { level: Number(heading[1]) }];
  return EDITOR_TOOL_TEXT[key];
};
