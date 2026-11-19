import type { JSCalendar } from "../src";

/** An event with the properties the format requires, and any others. */
export const event = (
  uid: string,
  start: string,
  rest: Partial<JSCalendar.Event> = {},
): JSCalendar.Event => ({
  "@type": "Event",
  uid,
  updated: "2026-01-01T00:00:00Z",
  start,
  duration: "PT1H",
  ...rest,
});
