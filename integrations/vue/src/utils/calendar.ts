import type {
  CalendarDay,
  CalendarGroup,
  CalendarTool,
  CalendarWeekday,
} from "../types/components/calendar";
import type { Day, Occurrence, Service } from "@zoobzio/calendar";

import {
  CALENDAR_NEXT_KEY,
  CALENDAR_NEXT_LABEL,
  CALENDAR_PREV_KEY,
  CALENDAR_PREV_LABEL,
  CALENDAR_TODAY_KEY,
  CALENDAR_TODAY_LABEL,
  CALENDAR_TOOL_GROUPS,
  CALENDAR_VIEW_LABELS,
  CALENDAR_WEEK_LENGTH,
} from "../constants/calendar";

/**
 * A calendar day as a `Date` at its UTC midnight. A day has no zone, so
 * it formats in UTC whatever zone the calendar reads in.
 */
const at = (day: Day): Date => new Date(`${day}T00:00:00Z`);

const format = (
  locale: string,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat =>
  new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" });

/**
 * What the view shows, as a heading reads it: the month of the date in
 * the month view, the day in the day view, and the span of the days in
 * the week and agenda views.
 */
export const calendarHeading = <I, O>(service: Service<I, O>): string => {
  const { locale } = service.context;
  const { view, date, days } = service;
  if (view === "month") {
    return format(locale, { month: "long", year: "numeric" }).format(at(date));
  }
  if (view === "day") {
    return format(locale, { dateStyle: "full" }).format(at(date));
  }
  return format(locale, { dateStyle: "medium" }).formatRange(
    at(days[0] ?? date),
    at(days[days.length - 1] ?? date),
  );
};

/**
 * The column headings of the grid: the days of the first week the view
 * shows, or the one day of the day view.
 */
export const calendarWeekdays = <I, O>(
  service: Service<I, O>,
): CalendarWeekday[] => {
  const { locale } = service.context;
  const short = format(locale, { weekday: "short" });
  const long = format(locale, { weekday: "long" });
  return service.days.slice(0, CALENDAR_WEEK_LENGTH).map((day) => ({
    key: String(at(day).getUTCDay()),
    label: short.format(at(day)),
    name: long.format(at(day)),
  }));
};

/**
 * The days of the view, each with the occurrences that touch it. A day of
 * the month view that belongs to the month before or after is `outside`.
 */
export const calendarDays = <I, O>(service: Service<I, O>): CalendarDay[] => {
  const { locale } = service.context;
  const { view, date, today } = service;
  const label = format(locale, { day: "numeric" });
  const name = format(locale, { dateStyle: "full" });
  const month = date.slice(0, 7);
  return service.days.map((day) => ({
    date: day,
    label: label.format(at(day)),
    name: name.format(at(day)),
    today: day === today,
    outside: view === "month" && !day.startsWith(month),
    occurrences: service.occurrencesOn(day),
  }));
};

/** The days in rows of a week. */
export const calendarWeeks = (days: CalendarDay[]): CalendarDay[][] =>
  Array.from(
    { length: Math.ceil(days.length / CALENDAR_WEEK_LENGTH) },
    (_, row) =>
      days.slice(row * CALENDAR_WEEK_LENGTH, (row + 1) * CALENDAR_WEEK_LENGTH),
  );

/**
 * The toolbar of a service: today, previous, and next, then one tool per
 * view where the service offers more than one. Reads the service's view,
 * date, and today, so a computed over it follows them: a view's tool is
 * `active` while the calendar is in it, and today's is `disabled` while
 * the calendar is on today.
 */
export const calendarTools = <I, O>(service: Service<I, O>): CalendarTool[] => {
  const { view, views, date, today } = service;
  const tools: CalendarTool[] = [
    {
      key: CALENDAR_TODAY_KEY,
      label: CALENDAR_TODAY_LABEL,
      kind: "action",
      group: "navigate",
      active: false,
      disabled: date === today,
      run: () => service.go(service.today),
    },
    {
      key: CALENDAR_PREV_KEY,
      label: CALENDAR_PREV_LABEL,
      kind: "action",
      group: "navigate",
      active: false,
      disabled: false,
      run: () => service.prev(),
    },
    {
      key: CALENDAR_NEXT_KEY,
      label: CALENDAR_NEXT_LABEL,
      kind: "action",
      group: "navigate",
      active: false,
      disabled: false,
      run: () => service.next(),
    },
  ];
  if (views.length > 1) {
    for (const offered of views) {
      tools.push({
        key: offered,
        label: CALENDAR_VIEW_LABELS[offered],
        kind: "toggle",
        group: "views",
        active: offered === view,
        disabled: false,
        run: () => service.show(offered),
      });
    }
  }
  return tools;
};

/** The tools in their groups, in the toolbar's order, the groups that hold one. */
export const calendarGroups = (tools: CalendarTool[]): CalendarGroup[] =>
  CALENDAR_TOOL_GROUPS.map((name) => ({
    name,
    tools: tools.filter((tool) => tool.group === name),
  })).filter((group) => group.tools.length > 0);

/**
 * The time an occurrence starts, as a cell reads it in the calendar's
 * zone. Empty for an occurrence that shows without its time.
 */
export const calendarTime = <I, O>(
  service: Service<I, O>,
  occurrence: Occurrence,
): string =>
  occurrence.allDay
    ? ""
    : new Intl.DateTimeFormat(service.context.locale, {
        timeStyle: "short",
        timeZone: service.context.timeZone,
      }).format(new Date(occurrence.start));
