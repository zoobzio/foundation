import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { CalendarHeaderProps as RekaCalendarHeaderProps } from "reka-ui";

export type CalendarHeaderForward = Reshape<RekaCalendarHeaderProps>;

export type CalendarHeaderProps = RekaCalendarHeaderProps & {
  modifiers?: ModifierProps<"calendar-header">;
  tokens?: TokenProps<"calendar-header">;
  aria?: AriaProps<"calendar-header">;
};

export type CalendarHeaderEmits = ComponentEvents["calendar-header"];

export type CalendarHeaderBindings = Bindings<"calendar-header", CalendarHeaderForward>;

export type CalendarHeaderContext = Reshape<CalendarHeaderProps> & {
  bindings: CalendarHeaderBindings;
  el: ComponentPublicInstance | null;
};

export type CalendarHeaderSlots = {
  default(props: CalendarHeaderContext): VNode[];
};
