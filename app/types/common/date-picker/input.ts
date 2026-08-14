import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DatePickerInputProps as RekaDatePickerInputProps } from "reka-ui";

export type DatePickerInputForward = Reshape<RekaDatePickerInputProps>;

export type DatePickerInputProps = RekaDatePickerInputProps & {
  modifiers?: ModifierProps<"date-picker-input">;
  tokens?: TokenProps<"date-picker-input">;
  aria?: AriaProps<"date-picker-input">;
};

export type DatePickerInputEmits = {};

export type DatePickerInputBindings = Bindings<
  "date-picker-input",
  DatePickerInputForward
>;

export type DatePickerInputContext = Reshape<DatePickerInputProps> & {
  bindings: DatePickerInputBindings;
  el: ComponentPublicInstance | null;
};

export type DatePickerInputSlots = {
  default(props: DatePickerInputContext): VNode[];
};
