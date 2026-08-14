import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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
