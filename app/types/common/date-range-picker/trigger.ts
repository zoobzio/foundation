import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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
