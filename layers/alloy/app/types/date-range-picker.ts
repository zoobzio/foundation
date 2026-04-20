import type { DateValue } from "@internationalized/date";
import type { DateRangePickerRootProps, DateRangePickerContentProps, DateRangePickerHeaderProps, DateRangePickerHeadingProps, DateRangePickerGridProps, DateRangePickerCellProps, DateRangePickerCellTriggerProps, DateRangePickerPrevProps, DateRangePickerNextProps } from "reka-ui";

export interface DateRange {
  start: DateValue;
  end: DateValue;
}

export type DateRangePickerPassthrough = {
  root?: Passthrough<DateRangePickerRootProps>;
  content?: Passthrough<DateRangePickerContentProps>;
  header?: Passthrough<DateRangePickerHeaderProps>;
  heading?: Passthrough<DateRangePickerHeadingProps>;
  grid?: Passthrough<DateRangePickerGridProps>;
  cell?: Passthrough<DateRangePickerCellProps>;
  cellTrigger?: Passthrough<DateRangePickerCellTriggerProps>;
  prev?: Passthrough<DateRangePickerPrevProps>;
  next?: Passthrough<DateRangePickerNextProps>;
};

export type DateRangePickerProps = {
  placeholder?: { start: string; end: string };
  minValue?: DateValue;
  maxValue?: DateValue;
  locale?: string;
  disabled?: boolean;
  numberOfMonths?: number;
  pt?: DateRangePickerPassthrough;
};

export type DateRangePickerEmits = {};

export const defineDateRangePicker = useComponentRecipe<DateRangePickerProps, DateRangePickerEmits>();

export type DateRangePickerRecipe = ComponentRecipe<DateRangePickerProps, DateRangePickerEmits>;
