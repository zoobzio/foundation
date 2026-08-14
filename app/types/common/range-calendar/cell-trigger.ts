import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { SlotProps } from "../../slots";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  RangeCalendarCellTrigger,
  RangeCalendarCellTriggerProps as RekaRangeCalendarCellTriggerProps,
} from "reka-ui";

export type RangeCalendarCellTriggerForward = Reshape<RekaRangeCalendarCellTriggerProps>;

export type RangeCalendarCellTriggerProps = RekaRangeCalendarCellTriggerProps & {
  modifiers?: ModifierProps<"range-calendar-cell-trigger">;
  tokens?: TokenProps<"range-calendar-cell-trigger">;
  aria?: AriaProps<"range-calendar-cell-trigger">;
};

export type RangeCalendarCellTriggerEmits = ComponentEvents["range-calendar-cell-trigger"];

export type RangeCalendarCellTriggerBindings = Bindings<
  "range-calendar-cell-trigger",
  RangeCalendarCellTriggerForward
>;

export type RangeCalendarCellTriggerContext = Reshape<RangeCalendarCellTriggerProps> & {
  bindings: RangeCalendarCellTriggerBindings;
  el: ComponentPublicInstance | null;
};

export type RangeCalendarCellTriggerSlots = {
  default(
    props: RangeCalendarCellTriggerContext & SlotProps<typeof RangeCalendarCellTrigger>,
  ): VNode[];
};
