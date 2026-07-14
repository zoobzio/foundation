import type { IconProps } from "#foundation/types/common/icon";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Recipe } from "#foundation/types/core/recipe";
import type { DateValue } from "@internationalized/date";
import type { PrimitiveProps, DatePickerRootProps, DatePickerRootEmits, DatePickerInputProps, DatePickerTriggerProps, DatePickerContentProps, DatePickerHeaderProps, DatePickerHeadingProps, DatePickerGridProps, DatePickerGridHeadProps, DatePickerGridBodyProps, DatePickerGridRowProps, DatePickerHeadCellProps, DatePickerCellProps, DatePickerCellTriggerProps, DatePickerPrevProps, DatePickerNextProps } from "reka-ui";

export type DatePickerPassthrough = {
  root?: Passthrough<DatePickerRootProps, DatePickerRootEmits>;
  field?: Passthrough<PrimitiveProps>;
  input?: Passthrough<DatePickerInputProps>;
  trigger?: Passthrough<DatePickerTriggerProps>;
  triggerIcon?: Passthrough<IconProps>;
  content?: Passthrough<DatePickerContentProps>;
  calendar?: Passthrough<PrimitiveProps>;
  header?: Passthrough<DatePickerHeaderProps>;
  prev?: Passthrough<DatePickerPrevProps>;
  prevIcon?: Passthrough<IconProps>;
  heading?: Passthrough<DatePickerHeadingProps>;
  next?: Passthrough<DatePickerNextProps>;
  nextIcon?: Passthrough<IconProps>;
  grid?: Passthrough<DatePickerGridProps>;
  gridHead?: Passthrough<DatePickerGridHeadProps>;
  gridBody?: Passthrough<DatePickerGridBodyProps>;
  gridRow?: Passthrough<DatePickerGridRowProps>;
  headCell?: Passthrough<DatePickerHeadCellProps>;
  cell?: Passthrough<DatePickerCellProps>;
  cellTrigger?: Passthrough<DatePickerCellTriggerProps>;
};

export type DatePickerProps = {
  modelValue?: DateValue;
  placeholder?: string;
  minValue?: DateValue;
  maxValue?: DateValue;
  locale?: string;
  disabled?: boolean;
  granularity?: "day" | "hour" | "minute" | "second";
  isDateDisabled?: (date: DateValue) => boolean;
  pt?: DatePickerPassthrough;
};

export type DatePickerEmits = {
  "update:modelValue": [value: DateValue | undefined];
};

export type DatePickerRecipe = Recipe<DatePickerProps, DatePickerEmits>;
