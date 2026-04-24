import type { DateValue } from "@internationalized/date";
import type { DatePickerRootProps, DatePickerRootEmits, DatePickerContentProps, DatePickerHeaderProps, DatePickerHeadingProps, DatePickerGridProps, DatePickerCellProps, DatePickerCellTriggerProps, DatePickerPrevProps, DatePickerNextProps } from "reka-ui";

export type DatePickerPassthrough = {
  root?: Passthrough<DatePickerRootProps, DatePickerRootEmits>;
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

export const defineDatePicker = defineComponentRecipe<DatePickerProps, DatePickerEmits>();

export type DatePickerRecipe = Recipe<DatePickerProps, DatePickerEmits>;
