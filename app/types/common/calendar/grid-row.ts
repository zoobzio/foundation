import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { CalendarGridRowProps as RekaCalendarGridRowProps } from "reka-ui";

export type CalendarGridRowForward = Reshape<RekaCalendarGridRowProps>;

export type CalendarGridRowProps = RekaCalendarGridRowProps & {
  modifiers?: ModifierProps<"calendar-grid-row">;
  tokens?: TokenProps<"calendar-grid-row">;
  aria?: AriaProps<"calendar-grid-row">;
};

export type CalendarGridRowEmits = ComponentEvents["calendar-grid-row"];

export type CalendarGridRowBindings = Bindings<"calendar-grid-row", CalendarGridRowForward>;

export type CalendarGridRowContext = Reshape<CalendarGridRowProps> & {
  bindings: CalendarGridRowBindings;
  el: ComponentPublicInstance | null;
};

export type CalendarGridRowSlots = {
  default(props: CalendarGridRowContext): VNode[];
};
