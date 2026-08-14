import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { CalendarGridRowProps as RekaCalendarGridRowProps } from "reka-ui";

export type CalendarGridRowForward = Reshape<RekaCalendarGridRowProps>;

export type CalendarGridRowProps = RekaCalendarGridRowProps & {
  modifiers?: ModifierProps<"calendar-grid-row">;
  tokens?: TokenProps<"calendar-grid-row">;
  aria?: AriaProps<"calendar-grid-row">;
};

export type CalendarGridRowEmits = {};

export type CalendarGridRowBindings = Bindings<"calendar-grid-row", CalendarGridRowForward>;

export type CalendarGridRowContext = Reshape<CalendarGridRowProps> & {
  bindings: CalendarGridRowBindings;
  el: ComponentPublicInstance | null;
};

export type CalendarGridRowSlots = {
  default(props: CalendarGridRowContext): VNode[];
};
