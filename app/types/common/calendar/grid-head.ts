import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { CalendarGridHeadProps as RekaCalendarGridHeadProps } from "reka-ui";

export type CalendarGridHeadForward = Reshape<RekaCalendarGridHeadProps>;

export type CalendarGridHeadProps = RekaCalendarGridHeadProps & {
  modifiers?: ModifierProps<"calendar-grid-head">;
  tokens?: TokenProps<"calendar-grid-head">;
  aria?: AriaProps<"calendar-grid-head">;
};

export type CalendarGridHeadEmits = ComponentEvents["calendar-grid-head"];

export type CalendarGridHeadBindings = Bindings<"calendar-grid-head", CalendarGridHeadForward>;

export type CalendarGridHeadContext = Reshape<CalendarGridHeadProps> & {
  bindings: CalendarGridHeadBindings;
  el: ComponentPublicInstance | null;
};

export type CalendarGridHeadSlots = {
  default(props: CalendarGridHeadContext): VNode[];
};
