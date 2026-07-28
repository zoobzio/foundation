import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { SlotProps } from "#foundation/types/slots";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  CalendarCellTrigger,
  CalendarCellTriggerProps as RekaCalendarCellTriggerProps,
} from "reka-ui";

export type CalendarCellTriggerForward = Reshape<RekaCalendarCellTriggerProps>;

export type CalendarCellTriggerProps = RekaCalendarCellTriggerProps & {
  modifiers?: ModifierProps<"calendar-cell-trigger">;
  tokens?: TokenProps<"calendar-cell-trigger">;
  aria?: AriaProps<"calendar-cell-trigger">;
};

export type CalendarCellTriggerEmits = ComponentEvents["calendar-cell-trigger"];

export type CalendarCellTriggerBindings = Bindings<
  "calendar-cell-trigger",
  CalendarCellTriggerForward
>;

export type CalendarCellTriggerContext = Reshape<CalendarCellTriggerProps> & {
  bindings: CalendarCellTriggerBindings;
  el: ComponentPublicInstance | null;
};

export type CalendarCellTriggerSlots = {
  default(
    props: CalendarCellTriggerContext & SlotProps<typeof CalendarCellTrigger>,
  ): VNode[];
};
