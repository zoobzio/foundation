import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DateRangePickerInputProps as RekaDateRangePickerInputProps } from "reka-ui";

export type DateRangePickerInputForward = Reshape<RekaDateRangePickerInputProps>;

export type DateRangePickerInputProps = RekaDateRangePickerInputProps & {
  modifiers?: ModifierProps<"date-range-picker-input">;
  tokens?: TokenProps<"date-range-picker-input">;
  aria?: AriaProps<"date-range-picker-input">;
};

export type DateRangePickerInputEmits = ComponentEvents["date-range-picker-input"];

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
