import type { DateValue } from "@internationalized/date";
import type { DateRange, RangeCalendarRootProps, RangeCalendarRootEmits, RangeCalendarHeaderProps, RangeCalendarHeadingProps, RangeCalendarGridProps, RangeCalendarGridHeadProps, RangeCalendarGridBodyProps, RangeCalendarGridRowProps, RangeCalendarHeadCellProps, RangeCalendarCellProps, RangeCalendarCellTriggerProps, RangeCalendarPrevProps, RangeCalendarNextProps } from "reka-ui";

export type RangeCalendarPassthrough = {
  root?: Passthrough<RangeCalendarRootProps, RangeCalendarRootEmits>;
  header?: Passthrough<RangeCalendarHeaderProps>;
  prev?: Passthrough<RangeCalendarPrevProps>;
  prevIcon?: Passthrough<IconProps>;
  heading?: Passthrough<RangeCalendarHeadingProps>;
  next?: Passthrough<RangeCalendarNextProps>;
  nextIcon?: Passthrough<IconProps>;
  grids?: Passthrough<GroupProps>;
  grid?: Passthrough<RangeCalendarGridProps>;
  gridHead?: Passthrough<RangeCalendarGridHeadProps>;
  gridBody?: Passthrough<RangeCalendarGridBodyProps>;
  gridRow?: Passthrough<RangeCalendarGridRowProps>;
  headCell?: Passthrough<RangeCalendarHeadCellProps>;
  cell?: Passthrough<RangeCalendarCellProps>;
  cellTrigger?: Passthrough<RangeCalendarCellTriggerProps>;
};

export type RangeCalendarProps = {
  modelValue?: DateRange;
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

export type RangeCalendarEmits = {
  "update:modelValue": [value: DateRange];
};

export type RangeCalendarRecipe = Recipe<RangeCalendarProps, RangeCalendarEmits>;
