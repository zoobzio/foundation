import type { DateValue } from "@internationalized/date";

export type RangeCalendarProps = {
  minValue?: DateValue;
  maxValue?: DateValue;
  locale?: string;
  numberOfMonths?: number;
  fixedWeeks?: boolean;
  disabled?: boolean;
  isDateDisabled?: (date: DateValue) => boolean;
  isDateUnavailable?: (date: DateValue) => boolean;
};

export type RangeCalendarEmits = {};

export const defineRangeCalendar = useComponentRecipe<RangeCalendarProps, RangeCalendarEmits>();

export type RangeCalendarRecipe = ComponentRecipe<RangeCalendarProps, RangeCalendarEmits>;
