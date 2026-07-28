import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { CalendarHeadCellProps as RekaCalendarHeadCellProps } from "reka-ui";

export type CalendarHeadCellForward = Reshape<RekaCalendarHeadCellProps>;

export type CalendarHeadCellProps = RekaCalendarHeadCellProps & {
  modifiers?: ModifierProps<"calendar-head-cell">;
  tokens?: TokenProps<"calendar-head-cell">;
  aria?: AriaProps<"calendar-head-cell">;
};

export type CalendarHeadCellEmits = ComponentEvents["calendar-head-cell"];

export type CalendarHeadCellBindings = Bindings<"calendar-head-cell", CalendarHeadCellForward>;

export type CalendarHeadCellContext = Reshape<CalendarHeadCellProps> & {
  bindings: CalendarHeadCellBindings;
  el: ComponentPublicInstance | null;
};

export type CalendarHeadCellSlots = {
  default(props: CalendarHeadCellContext): VNode[];
};
