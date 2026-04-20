import type { DateValue } from "@internationalized/date";
import type { CalendarRootProps, CalendarHeaderProps, CalendarHeadingProps, CalendarGridProps, CalendarCellProps, CalendarCellTriggerProps, CalendarPrevProps, CalendarNextProps } from "reka-ui";

export type CalendarPassthrough = {
  root?: Passthrough<CalendarRootProps>;
  header?: Passthrough<CalendarHeaderProps>;
  heading?: Passthrough<CalendarHeadingProps>;
  grid?: Passthrough<CalendarGridProps>;
  cell?: Passthrough<CalendarCellProps>;
  cellTrigger?: Passthrough<CalendarCellTriggerProps>;
  prev?: Passthrough<CalendarPrevProps>;
  next?: Passthrough<CalendarNextProps>;
};

export type CalendarProps = {
  minValue?: DateValue;
  maxValue?: DateValue;
  locale?: string;
  numberOfMonths?: number;
  fixedWeeks?: boolean;
  disabled?: boolean;
  isDateDisabled?: (date: DateValue) => boolean;
  isDateUnavailable?: (date: DateValue) => boolean;
  pt?: CalendarPassthrough;
};

export type CalendarEmits = {};

export const defineCalendar = useComponentRecipe<CalendarProps, CalendarEmits>();

export type CalendarRecipe = ComponentRecipe<CalendarProps, CalendarEmits>;
