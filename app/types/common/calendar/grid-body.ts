import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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
