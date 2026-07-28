import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { SlotProps } from "#foundation/types/slots";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  DateRangePickerCellTrigger,
  DateRangePickerCellTriggerProps as RekaDateRangePickerCellTriggerProps,
} from "reka-ui";

export type DateRangePickerCellTriggerForward = Reshape<RekaDateRangePickerCellTriggerProps>;

export type DateRangePickerCellTriggerProps = RekaDateRangePickerCellTriggerProps & {
  modifiers?: ModifierProps<"date-range-picker-cell-trigger">;
  tokens?: TokenProps<"date-range-picker-cell-trigger">;
  aria?: AriaProps<"date-range-picker-cell-trigger">;
};

export type DateRangePickerCellTriggerEmits = ComponentEvents["date-range-picker-cell-trigger"];

export type DateRangePickerCellTriggerBindings = Bindings<
  "date-range-picker-cell-trigger",
  DateRangePickerCellTriggerForward
>;

export type DateRangePickerCellTriggerContext = Reshape<DateRangePickerCellTriggerProps> & {
  bindings: DateRangePickerCellTriggerBindings;
  el: ComponentPublicInstance | null;
};

export type DateRangePickerCellTriggerSlots = {
  default(
    props: DateRangePickerCellTriggerContext & SlotProps<typeof DateRangePickerCellTrigger>,
  ): VNode[];
};
