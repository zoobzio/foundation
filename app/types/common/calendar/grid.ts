import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { CalendarGridProps as RekaCalendarGridProps } from "reka-ui";

export type CalendarGridForward = Reshape<RekaCalendarGridProps>;

export type CalendarGridProps = RekaCalendarGridProps & {
  modifiers?: ModifierProps<"calendar-grid">;
  tokens?: TokenProps<"calendar-grid">;
  aria?: AriaProps<"calendar-grid">;
};

export type CalendarGridEmits = ComponentEvents["calendar-grid"];

export type CalendarGridBindings = Bindings<"calendar-grid", CalendarGridForward>;

export type CalendarGridContext = Reshape<CalendarGridProps> & {
  bindings: CalendarGridBindings;
  el: ComponentPublicInstance | null;
};

export type CalendarGridSlots = {
  default(props: CalendarGridContext): VNode[];
};
