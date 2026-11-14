import type { IconAlias } from "../types/icon";
import type { AppMessage } from "../types/text";

import { CALENDAR_TOOL_ICONS, CALENDAR_TOOL_TEXT } from "../constants/calendar";

/**
 * The icon of a calendar tool, by its key. Today and the views have none,
 * and neither does a tool the layer does not name.
 */
export const toolIcon = (key: string): IconAlias | undefined =>
  CALENDAR_TOOL_ICONS[key];

/**
 * The text of a calendar tool, by its key, as a message of the contract.
 * A tool the layer does not name has none, and its own label stands.
 */
export const toolText = (key: string): AppMessage | undefined =>
  CALENDAR_TOOL_TEXT[key];
