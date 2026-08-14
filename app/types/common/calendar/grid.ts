import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { CalendarGridProps as RekaCalendarGridProps } from "reka-ui";

export type CalendarGridForward = Reshape<RekaCalendarGridProps>;

export type CalendarGridProps = RekaCalendarGridProps & {
  modifiers?: ModifierProps<"calendar-grid">;
  tokens?: TokenProps<"calendar-grid">;
  aria?: AriaProps<"calendar-grid">;
};

export type CalendarGridEmits = {};

export type CalendarGridBindings = Bindings<"calendar-grid", CalendarGridForward>;

export type CalendarGridContext = Reshape<CalendarGridProps> & {
  bindings: CalendarGridBindings;
  el: ComponentPublicInstance | null;
};

export type CalendarGridSlots = {
  default(props: CalendarGridContext): VNode[];
};
