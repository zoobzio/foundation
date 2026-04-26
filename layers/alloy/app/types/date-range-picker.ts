import type { DateValue } from "@internationalized/date";
import type { PrimitiveProps, DateRangePickerRootProps, DateRangePickerRootEmits, DateRangePickerInputProps, DateRangePickerTriggerProps, DateRangePickerContentProps, DateRangePickerHeaderProps, DateRangePickerHeadingProps, DateRangePickerGridProps, DateRangePickerGridHeadProps, DateRangePickerGridBodyProps, DateRangePickerGridRowProps, DateRangePickerHeadCellProps, DateRangePickerCellProps, DateRangePickerCellTriggerProps, DateRangePickerPrevProps, DateRangePickerNextProps } from "reka-ui";

export interface DateRange {
  start: DateValue;
  end: DateValue;
}

export type DateRangePickerPassthrough = {
  root?: Passthrough<DateRangePickerRootProps, DateRangePickerRootEmits>;
  field?: Passthrough<PrimitiveProps>;
  input?: Passthrough<DateRangePickerInputProps>;
  separator?: Passthrough<EmProps>;
  trigger?: Passthrough<DateRangePickerTriggerProps>;
  triggerIcon?: Passthrough<IconProps>;
  content?: Passthrough<DateRangePickerContentProps>;
  calendar?: Passthrough<PrimitiveProps>;
  header?: Passthrough<DateRangePickerHeaderProps>;
  prev?: Passthrough<DateRangePickerPrevProps>;
  prevIcon?: Passthrough<IconProps>;
  heading?: Passthrough<DateRangePickerHeadingProps>;
  next?: Passthrough<DateRangePickerNextProps>;
  nextIcon?: Passthrough<IconProps>;
  grids?: Passthrough<GroupProps>;
  grid?: Passthrough<DateRangePickerGridProps>;
  gridHead?: Passthrough<DateRangePickerGridHeadProps>;
  gridBody?: Passthrough<DateRangePickerGridBodyProps>;
  gridRow?: Passthrough<DateRangePickerGridRowProps>;
  headCell?: Passthrough<DateRangePickerHeadCellProps>;
  cell?: Passthrough<DateRangePickerCellProps>;
  cellTrigger?: Passthrough<DateRangePickerCellTriggerProps>;
};

export type DateRangePickerProps = {
  modelValue?: DateRange;
  placeholder?: { start: string; end: string };
  minValue?: DateValue;
  maxValue?: DateValue;
  locale?: string;
  disabled?: boolean;
  numberOfMonths?: number;
  pt?: DateRangePickerPassthrough;
};

export type DateRangePickerEmits = {
  "update:modelValue": [value: DateRange];
};

export type DateRangePickerRecipe = Recipe<DateRangePickerProps, DateRangePickerEmits>;
