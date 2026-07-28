import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { CalendarCellProps as RekaCalendarCellProps } from "reka-ui";

export type CalendarCellForward = Reshape<RekaCalendarCellProps>;

export type CalendarCellProps = RekaCalendarCellProps & {
  modifiers?: ModifierProps<"calendar-cell">;
  tokens?: TokenProps<"calendar-cell">;
  aria?: AriaProps<"calendar-cell">;
};

export type CalendarCellEmits = ComponentEvents["calendar-cell"];

export type CalendarCellBindings = Bindings<"calendar-cell", CalendarCellForward>;

export type CalendarCellContext = Reshape<CalendarCellProps> & {
  bindings: CalendarCellBindings;
  el: ComponentPublicInstance | null;
};

export type CalendarCellSlots = {
  default(props: CalendarCellContext): VNode[];
};
