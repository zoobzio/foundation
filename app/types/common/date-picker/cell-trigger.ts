import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { SlotProps } from "../../slots";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  DatePickerCellTrigger,
  DatePickerCellTriggerProps as RekaDatePickerCellTriggerProps,
} from "reka-ui";

export type DatePickerCellTriggerForward = Reshape<RekaDatePickerCellTriggerProps>;

export type DatePickerCellTriggerProps = RekaDatePickerCellTriggerProps & {
  modifiers?: ModifierProps<"date-picker-cell-trigger">;
  tokens?: TokenProps<"date-picker-cell-trigger">;
  aria?: AriaProps<"date-picker-cell-trigger">;
};

export type DatePickerCellTriggerEmits = ComponentEvents["date-picker-cell-trigger"];

export type DatePickerCellTriggerBindings = Bindings<
  "date-picker-cell-trigger",
  DatePickerCellTriggerForward
>;

export type DatePickerCellTriggerContext = Reshape<DatePickerCellTriggerProps> & {
  bindings: DatePickerCellTriggerBindings;
  el: ComponentPublicInstance | null;
};

export type DatePickerCellTriggerSlots = {
  default(
    props: DatePickerCellTriggerContext & SlotProps<typeof DatePickerCellTrigger>,
  ): VNode[];
};
