import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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
