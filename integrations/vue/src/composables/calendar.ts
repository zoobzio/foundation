import type {
  CalendarDay,
  CalendarGroup,
  CalendarTool,
  CalendarWeekday,
} from "../types/components/calendar";
import type { ComputedRef } from "vue";
import type { Day, Occurrence, Service } from "@zoobzio/calendar";

import { computed } from "vue";
import {
  calendarDays,
  calendarGroups,
  calendarHeading,
  calendarTime,
  calendarTools,
  calendarWeekdays,
  calendarWeeks,
} from "../utils/calendar";

/**
 * The calendar's view model over a service: the toolbar's tools and their
 * groups, the heading, the column headings, the days with their
 * occurrences, flat and in rows of a week, an occurrence's time, and
 * `open`, which moves the
 * date to a day and shows it in the day view where the service offers one.
 * `calendar.vue` is one rendering of it; a consumer's own component is
 * another.
 *
 * @param service - The calendar service. Its state container must be
 * reactive for the view model to follow it.
 */
export const useCalendar = <I, O>(
  service: Service<I, O>,
): {
  heading: ComputedRef<string>;
  weekdays: ComputedRef<CalendarWeekday[]>;
  days: ComputedRef<CalendarDay[]>;
  weeks: ComputedRef<CalendarDay[][]>;
  tools: ComputedRef<CalendarTool[]>;
  groups: ComputedRef<CalendarGroup[]>;
  time: (occurrence: Occurrence) => string;
  open: (day: Day) => void;
} => {
  const heading = computed(() => calendarHeading(service));
  const weekdays = computed(() => calendarWeekdays(service));
  const days = computed(() => calendarDays(service));
  const weeks = computed(() => calendarWeeks(days.value));
  const tools = computed(() => calendarTools(service));
  const groups = computed(() => calendarGroups(tools.value));

  const time = (occurrence: Occurrence) => calendarTime(service, occurrence);

  const open = (day: Day) => {
    service.go(day);
    service.show("day");
  };

  return { tools, groups, heading, weekdays, days, weeks, time, open };
};
