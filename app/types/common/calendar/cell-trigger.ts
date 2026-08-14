import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { EventEmits } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { SlotProps } from "../../slots";
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

export type CalendarCellTriggerEmits = EventEmits<"click">;

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
