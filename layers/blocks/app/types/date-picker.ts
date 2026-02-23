import type { DateValue } from "@internationalized/date";

export type DatePickerProps = {
  placeholder?: string;
  minValue?: DateValue;
  maxValue?: DateValue;
  locale?: string;
  disabled?: boolean;
  granularity?: "day" | "hour" | "minute" | "second";
  isDateDisabled?: (date: DateValue) => boolean;
};

export type DatePickerEmits = {};

export const defineDatePicker = useComponentRecipe<DatePickerProps, DatePickerEmits>();
