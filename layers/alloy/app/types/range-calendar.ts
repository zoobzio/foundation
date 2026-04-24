import type { DateValue } from "@internationalized/date";
import type { RangeCalendarRootProps, RangeCalendarRootEmits, RangeCalendarHeaderProps, RangeCalendarHeadingProps, RangeCalendarGridProps, RangeCalendarCellProps, RangeCalendarCellTriggerProps, RangeCalendarPrevProps, RangeCalendarNextProps } from "reka-ui";

export type RangeCalendarPassthrough = {
  root?: Passthrough<RangeCalendarRootProps, RangeCalendarRootEmits>;
  header?: Passthrough<RangeCalendarHeaderProps>;
  heading?: Passthrough<RangeCalendarHeadingProps>;
  grid?: Passthrough<RangeCalendarGridProps>;
  cell?: Passthrough<RangeCalendarCellProps>;
  cellTrigger?: Passthrough<RangeCalendarCellTriggerProps>;
  prev?: Passthrough<RangeCalendarPrevProps>;
  next?: Passthrough<RangeCalendarNextProps>;
};

export type RangeCalendarProps = {
  minValue?: DateValue;
  maxValue?: DateValue;
  locale?: string;
  numberOfMonths?: number;
  fixedWeeks?: boolean;
  disabled?: boolean;
  isDateDisabled?: (date: DateValue) => boolean;
  isDateUnavailable?: (date: DateValue) => boolean;
  pt?: RangeCalendarPassthrough;
};

export type RangeCalendarEmits = {};

export const defineRangeCalendar = defineComponentRecipe<RangeCalendarProps, RangeCalendarEmits>();

export type RangeCalendarRecipe = Recipe<RangeCalendarProps, RangeCalendarEmits>;
