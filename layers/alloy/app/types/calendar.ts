import type { DateValue } from "@internationalized/date";
import type { CalendarRootProps, CalendarRootEmits, CalendarHeaderProps, CalendarHeadingProps, CalendarGridProps, CalendarGridHeadProps, CalendarGridBodyProps, CalendarGridRowProps, CalendarHeadCellProps, CalendarCellProps, CalendarCellTriggerProps, CalendarPrevProps, CalendarNextProps } from "reka-ui";

export type CalendarPassthrough = {
  root?: Passthrough<CalendarRootProps, CalendarRootEmits>;
  header?: Passthrough<CalendarHeaderProps>;
  prev?: Passthrough<CalendarPrevProps>;
  prevIcon?: Passthrough<IconProps>;
  heading?: Passthrough<CalendarHeadingProps>;
  next?: Passthrough<CalendarNextProps>;
  nextIcon?: Passthrough<IconProps>;
  grid?: Passthrough<CalendarGridProps>;
  gridHead?: Passthrough<CalendarGridHeadProps>;
  gridBody?: Passthrough<CalendarGridBodyProps>;
  gridRow?: Passthrough<CalendarGridRowProps>;
  headCell?: Passthrough<CalendarHeadCellProps>;
  cell?: Passthrough<CalendarCellProps>;
  cellTrigger?: Passthrough<CalendarCellTriggerProps>;
};

export type CalendarProps = {
  modelValue?: DateValue;
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

export type CalendarEmits = {
  "update:modelValue": [value: DateValue | undefined];
};

export type CalendarRecipe = Recipe<CalendarProps, CalendarEmits>;
