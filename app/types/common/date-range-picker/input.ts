import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DateRangePickerInputProps as RekaDateRangePickerInputProps } from "reka-ui";

export type DateRangePickerInputForward = Reshape<RekaDateRangePickerInputProps>;

export type DateRangePickerInputProps = RekaDateRangePickerInputProps & {
  modifiers?: ModifierProps<"date-range-picker-input">;
  tokens?: TokenProps<"date-range-picker-input">;
  aria?: AriaProps<"date-range-picker-input">;
};

export type DateRangePickerInputEmits = {};

export type DateRangePickerInputBindings = Bindings<
  "date-range-picker-input",
  DateRangePickerInputForward
>;

export type DateRangePickerInputContext = Reshape<DateRangePickerInputProps> & {
  bindings: DateRangePickerInputBindings;
  el: ComponentPublicInstance | null;
};

export type DateRangePickerInputSlots = {
  default(props: DateRangePickerInputContext): VNode[];
};
