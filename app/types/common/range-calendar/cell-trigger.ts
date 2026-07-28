import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { SlotProps } from "#foundation/types/slots";
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
