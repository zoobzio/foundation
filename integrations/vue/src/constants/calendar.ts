import type {
  CalendarEmits,
  CalendarToolGroup,
} from "../types/components/calendar";
import type { View } from "@zoobzio/calendar";

/** The service events the calendar relays as emits. Each is a declared emit. */
export const CALENDAR_EVENTS = [
  "navigated",
  "loaded",
  "changed",
  "selected",
  "filtered",
  "restored",
] as const satisfies readonly (keyof CalendarEmits<unknown>)[];

/** The groups of the toolbar, in the order they render. */
export const CALENDAR_TOOL_GROUPS: readonly CalendarToolGroup[] = [
  "navigate",
  "views",
];

/** The group the heading stands after. */
export const CALENDAR_HEADING_GROUP: CalendarToolGroup = "navigate";

export const CALENDAR_TODAY_KEY = "today";
export const CALENDAR_PREV_KEY = "prev";
export const CALENDAR_NEXT_KEY = "next";

export const CALENDAR_TODAY_LABEL = "Today";
export const CALENDAR_PREV_LABEL = "Previous";
export const CALENDAR_NEXT_LABEL = "Next";
export const CALENDAR_UNTITLED_LABEL = "Untitled";
export const CALENDAR_EMPTY_TEXT = "Nothing scheduled";
export const CALENDAR_SEARCH_PLACEHOLDER = "Search...";
export const CALENDAR_REFRESH_LABEL = "Refresh";

/** The name of each view, as its tool reads. */
export const CALENDAR_VIEW_LABELS: Record<View, string> = {
  month: "Month",
  week: "Week",
  day: "Day",
  agenda: "Agenda",
};

/** The days of a week: a row of the grid. */
export const CALENDAR_WEEK_LENGTH = 7;
