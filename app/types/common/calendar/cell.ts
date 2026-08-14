import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { CalendarCellProps as RekaCalendarCellProps } from "reka-ui";

export type CalendarCellForward = Reshape<RekaCalendarCellProps>;

export type CalendarCellProps = RekaCalendarCellProps & {
  modifiers?: ModifierProps<"calendar-cell">;
  tokens?: TokenProps<"calendar-cell">;
  aria?: AriaProps<"calendar-cell">;
};

export type CalendarCellEmits = {};

export type CalendarCellBindings = Bindings<"calendar-cell", CalendarCellForward>;

export type CalendarCellContext = Reshape<CalendarCellProps> & {
  bindings: CalendarCellBindings;
  el: ComponentPublicInstance | null;
};

export type CalendarCellSlots = {
  default(props: CalendarCellContext): VNode[];
};
