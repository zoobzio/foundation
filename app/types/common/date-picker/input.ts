import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DatePickerInputProps as RekaDatePickerInputProps } from "reka-ui";

export type DatePickerInputForward = Reshape<RekaDatePickerInputProps>;

export type DatePickerInputProps = RekaDatePickerInputProps & {
  modifiers?: ModifierProps<"date-picker-input">;
  tokens?: TokenProps<"date-picker-input">;
  aria?: AriaProps<"date-picker-input">;
};

export type DatePickerInputEmits = ComponentEvents["date-picker-input"];

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
