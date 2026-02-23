import type { DateValue } from "@internationalized/date";

export type CalendarProps = {
  minValue?: DateValue;
  maxValue?: DateValue;
  locale?: string;
  numberOfMonths?: number;
  fixedWeeks?: boolean;
  disabled?: boolean;
  isDateDisabled?: (date: DateValue) => boolean;
  isDateUnavailable?: (date: DateValue) => boolean;
};

export type CalendarEmits = {};

export const defineCalendar = useComponentRecipe<CalendarProps, CalendarEmits>();
