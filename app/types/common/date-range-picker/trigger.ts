import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DateRangePickerTriggerProps as RekaDateRangePickerTriggerProps } from "reka-ui";

export type DateRangePickerTriggerForward = Reshape<RekaDateRangePickerTriggerProps>;

export type DateRangePickerTriggerProps = RekaDateRangePickerTriggerProps & {
  modifiers?: ModifierProps<"date-range-picker-trigger">;
  tokens?: TokenProps<"date-range-picker-trigger">;
  aria?: AriaProps<"date-range-picker-trigger">;
};

export type DateRangePickerTriggerEmits = ComponentEvents["date-range-picker-trigger"];

export type DateRangePickerTriggerBindings = Bindings<
  "date-range-picker-trigger",
  DateRangePickerTriggerForward
>;

export type DateRangePickerTriggerContext = Reshape<DateRangePickerTriggerProps> & {
  bindings: DateRangePickerTriggerBindings;
  el: ComponentPublicInstance | null;
};

export type DateRangePickerTriggerSlots = {
  default(props: DateRangePickerTriggerContext): VNode[];
};
