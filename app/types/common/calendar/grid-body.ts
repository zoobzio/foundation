import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { CalendarGridBodyProps as RekaCalendarGridBodyProps } from "reka-ui";

export type CalendarGridBodyForward = Reshape<RekaCalendarGridBodyProps>;

export type CalendarGridBodyProps = RekaCalendarGridBodyProps & {
  modifiers?: ModifierProps<"calendar-grid-body">;
  tokens?: TokenProps<"calendar-grid-body">;
  aria?: AriaProps<"calendar-grid-body">;
};

export type CalendarGridBodyEmits = ComponentEvents["calendar-grid-body"];

export type CalendarGridBodyBindings = Bindings<"calendar-grid-body", CalendarGridBodyForward>;

export type CalendarGridBodyContext = Reshape<CalendarGridBodyProps> & {
  bindings: CalendarGridBodyBindings;
  el: ComponentPublicInstance | null;
};

export type CalendarGridBodySlots = {
  default(props: CalendarGridBodyContext): VNode[];
};
