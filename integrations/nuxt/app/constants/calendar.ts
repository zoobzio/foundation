import type { IconAlias } from "../types/icon";
import type { AppMessage } from "../types/text";

/**
 * The icon of each calendar tool, by the tool's key: the two steps. Today
 * and the views have none: each reads by name. The calendar wrapper draws
 * these as each button's content, in place of the label text.
 */
export const CALENDAR_TOOL_ICONS: Readonly<Record<string, IconAlias>> = {
  prev: "prev",
  next: "next",
};

/**
 * The message of each calendar tool's label, by the tool's key: today, the
 * two steps, and the views.
 */
export const CALENDAR_TOOL_TEXT: Readonly<Record<string, AppMessage>> = {
  today: "calendar.today",
  prev: "calendar.previous",
  next: "calendar.next",
  month: "calendar.month",
  week: "calendar.week",
  day: "calendar.day",
  agenda: "calendar.agenda",
};
