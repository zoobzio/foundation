import type { TimelineEmits } from "../types/components/timeline";
import type { Grouping, RecordData } from "@zoobzio/timeline";

/** The service events the timeline relays as emits. Each is a declared emit. */
export const TIMELINE_EVENTS = [
  "loaded",
  "appended",
  "selected",
  "filtered",
  "restored",
] as const satisfies readonly (keyof TimelineEmits<RecordData>)[];

export const TIMELINE_EMPTY_TEXT = "Nothing yet";
export const TIMELINE_MORE_LABEL = "Load more";
export const TIMELINE_SEARCH_PLACEHOLDER = "Search...";
export const TIMELINE_REFRESH_LABEL = "Refresh";

/** How a group's span reads as its heading, by what the timeline groups under. */
export const TIMELINE_GROUP_FORMATS: Record<
  Exclude<Grouping, "none">,
  Intl.DateTimeFormatOptions
> = {
  day: { dateStyle: "medium" },
  month: { month: "long", year: "numeric" },
  year: { year: "numeric" },
};

/**
 * How a record's time reads on its card: the time alone under a day's
 * heading, which says the date, and the date with it otherwise.
 */
export const TIMELINE_TIME_FORMATS: Record<
  Grouping,
  Intl.DateTimeFormatOptions
> = {
  day: { timeStyle: "short" },
  month: { dateStyle: "medium", timeStyle: "short" },
  year: { dateStyle: "medium", timeStyle: "short" },
  none: { dateStyle: "medium", timeStyle: "short" },
};
