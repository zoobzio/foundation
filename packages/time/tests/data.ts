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

/** A task with the properties the format requires, and any others. */
export const task = (
  uid: string,
  rest: Partial<JSCalendar.Task> = {},
): JSCalendar.Task => ({
  "@type": "Task",
  uid,
  updated: "2026-01-01T00:00:00Z",
  ...rest,
});

/** March 2026: the range most tests read. It starts on a Sunday. */
export const march = {
  start: "2026-03-01T00:00:00Z",
  end: "2026-04-01T00:00:00Z",
};
