import type { IconAlias } from "../types/icon";

import { EDITOR_TOOL_ICONS } from "../constants/editor";

/**
 * The icon of an editor tool, by its key. A heading tool's key carries its
 * level (`heading-2`), and every level draws the one `heading` icon.
 */
export const toolIcon = (key: string): IconAlias | undefined =>
  EDITOR_TOOL_ICONS[/^heading-\d+$/.test(key) ? "heading" : key];
