import type { DateValue } from "@internationalized/date";

export interface DateRange {
  start: DateValue;
  end: DateValue;
}

export type DateRangePickerProps = {
  placeholder?: { start: string; end: string };
  minValue?: DateValue;
  maxValue?: DateValue;
  locale?: string;
  disabled?: boolean;
  numberOfMonths?: number;
};

export type DateRangePickerEmits = {};

export const defineDateRangePicker = useComponentRecipe<DateRangePickerProps, DateRangePickerEmits>();
