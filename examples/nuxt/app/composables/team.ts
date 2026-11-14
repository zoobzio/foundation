// The team calendar of the example: a calendar over a fake backend, an
// array in memory that `fetch` reads and `save` writes. The entries are
// dated around today, so the page always has something on it.
import type { Doc, JSCalendar, Mutation } from "@zoobzio/calendar";

import { json } from "@zoobzio/calendar";
import { createCalendar } from "@zoobzio/nuxt/factories/calendar";

const DAY = 86_400_000;

/** Midnight of today, in UTC, moved by a number of days. */
const day = (offset = 0): Date => {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) +
      offset * DAY,
  );
};

/** A day at a time of day, as a JSCalendar local date-time. */
const at = (date: Date, time = "00:00"): string =>
  `${date.toISOString().slice(0, 10)}T${time}:00`;

/** The weekday of this week, Monday first, moved by a number of weeks. */
const weekday = (index: number, weeks = 0): Date => {
  const monday = day(-((day().getUTCDay() + 6) % 7));
  return new Date(monday.getTime() + (index + weeks * 7) * DAY);
};

/** The last Friday of the month a number of months from this one. */
const lastFriday = (months: number): Date => {
  const now = day();
  const end = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + months + 1, 0),
  );
  return new Date(end.getTime() - ((end.getUTCDay() + 2) % 7) * DAY);
};

const updated = `${new Date().toISOString().slice(0, 19)}Z`;

const event = (
  uid: string,
  start: string,
  rest: Partial<JSCalendar.Event>,
): JSCalendar.Event => ({ "@type": "Event", uid, updated, start, ...rest });

let entries: Doc = [
  event("standup", at(weekday(0, -6), "09:30"), {
    title: "Standup",
    duration: "PT15M",
    recurrenceRule: {
      frequency: "weekly",
      byDay: [{ day: "mo" }, { day: "we" }, { day: "fr" }],
    },
  }),
  event("review", at(weekday(3, -4), "14:00"), {
    title: "Design review",
    duration: "PT1H",
    recurrenceRule: { frequency: "weekly", interval: 2 },
    recurrenceOverrides: {
      // This week's review moved to the end of the day; the next is off.
      [at(weekday(3), "14:00")]: {
        title: "Design review (moved)",
        start: at(weekday(3), "16:30"),
      },
      [at(weekday(3, 2), "14:00")]: { excluded: true },
    },
  }),
  event("payroll", at(lastFriday(-2)), {
    title: "Payroll",
    duration: "P1D",
    showWithoutTime: true,
    recurrenceRule: {
      frequency: "monthly",
      byDay: [{ day: "fr", nthOfPeriod: -1 }],
    },
  }),
  event("lunch", at(day(), "12:30"), {
    title: "Lunch with Sam",
    duration: "PT1H",
  }),
  event("offsite", at(day(6)), {
    title: "Offsite",
    duration: "P3D",
    showWithoutTime: true,
  }),
  event("flight", at(day(9), "22:00"), {
    title: "Flight home",
    duration: "PT5H",
  }),
  event("untitled", at(day(2), "11:00"), { duration: "PT30M" }),
  {
    "@type": "Task",
    uid: "report",
    updated,
    title: "Quarterly report",
    due: at(day(3), "17:00"),
  },
];

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** The backend's read: every entry, a recurring one whole. */
const fetch = async (): Promise<Doc> => {
  await pause(150);
  return structuredClone(entries);
};

/** The backend's write: the stored entries replace by `uid`, the removed go. */
const save = async (mutation: Mutation<Doc>): Promise<void> => {
  await pause(150);
  const gone = new Set(
    [...mutation.entries, ...mutation.removed].map((entry) => entry.uid),
  );
  entries = [
    ...entries.filter((entry) => !gone.has(entry.uid)),
    ...structuredClone(mutation.entries),
  ];
};

export const useTeam = createCalendar<Doc, Doc>("team", {
  ...json,
  fetch,
  save,
  timeZone: "UTC",
  firstDayOfWeek: "mo",
});
