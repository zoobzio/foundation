import type { DateValue } from "@internationalized/date";
import type { DatePickerRootProps, DatePickerContentProps, DatePickerHeaderProps, DatePickerHeadingProps, DatePickerGridProps, DatePickerCellProps, DatePickerCellTriggerProps, DatePickerPrevProps, DatePickerNextProps } from "reka-ui";

export type DatePickerPassthrough = {
  root?: Passthrough<DatePickerRootProps>;
  content?: Passthrough<DatePickerContentProps>;
  header?: Passthrough<DatePickerHeaderProps>;
  heading?: Passthrough<DatePickerHeadingProps>;
  grid?: Passthrough<DatePickerGridProps>;
  cell?: Passthrough<DatePickerCellProps>;
  cellTrigger?: Passthrough<DatePickerCellTriggerProps>;
  prev?: Passthrough<DatePickerPrevProps>;
  next?: Passthrough<DatePickerNextProps>;
};

export type DatePickerProps = {
  placeholder?: string;
  minValue?: DateValue;
  maxValue?: DateValue;
  locale?: string;
  disabled?: boolean;
  granularity?: "day" | "hour" | "minute" | "second";
  isDateDisabled?: (date: DateValue) => boolean;
  pt?: DatePickerPassthrough;
};

export type DatePickerEmits = {};

export const defineDatePicker = useComponentRecipe<DatePickerProps, DatePickerEmits>();

export type DatePickerRecipe = ComponentRecipe<DatePickerProps, DatePickerEmits>;
