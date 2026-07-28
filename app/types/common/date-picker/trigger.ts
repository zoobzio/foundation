import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DatePickerTriggerProps as RekaDatePickerTriggerProps } from "reka-ui";

export type DatePickerTriggerForward = Reshape<RekaDatePickerTriggerProps>;

export type DatePickerTriggerProps = RekaDatePickerTriggerProps & {
  modifiers?: ModifierProps<"date-picker-trigger">;
  tokens?: TokenProps<"date-picker-trigger">;
  aria?: AriaProps<"date-picker-trigger">;
};

export type DatePickerTriggerEmits = ComponentEvents["date-picker-trigger"];

export type DatePickerTriggerBindings = Bindings<
  "date-picker-trigger",
  DatePickerTriggerForward
>;

export type DatePickerTriggerContext = Reshape<DatePickerTriggerProps> & {
  bindings: DatePickerTriggerBindings;
  el: ComponentPublicInstance | null;
};

export type DatePickerTriggerSlots = {
  default(props: DatePickerTriggerContext): VNode[];
};
