import type { JSCalendar } from "@zoobzio/calendar";

/** The instant the test calendars read as now: Wednesday 4 March 2026. */
export const NOW = new Date("2026-03-04T12:00:00Z");

const event = (
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

/**
 * A weekly standup on Mondays, a lunch on the 4th, an untitled all-day
 * offsite across the 10th and 11th, and a task due on the 6th.
 */
export const fakeEntries: JSCalendar.Entry[] = [
  event("standup", "2026-03-02T09:00:00", {
    title: "Standup",
    recurrenceRule: { frequency: "weekly" },
  }),
  event("lunch", "2026-03-04T12:30:00", { title: "Lunch" }),
  event("offsite", "2026-03-10T00:00:00", {
    duration: "P2D",
    showWithoutTime: true,
  }),
  {
    "@type": "Task",
    uid: "report",
    updated: "2026-01-01T00:00:00Z",
    title: "Report",
    due: "2026-03-06T17:00:00",
  },
];
