import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { CalendarHeaderProps as RekaCalendarHeaderProps } from "reka-ui";

export type CalendarHeaderForward = Reshape<RekaCalendarHeaderProps>;

export type CalendarHeaderProps = RekaCalendarHeaderProps & {
  modifiers?: ModifierProps<"calendar-header">;
  tokens?: TokenProps<"calendar-header">;
  aria?: AriaProps<"calendar-header">;
};

export type CalendarHeaderEmits = {};

export type CalendarHeaderBindings = Bindings<"calendar-header", CalendarHeaderForward>;

export type CalendarHeaderContext = Reshape<CalendarHeaderProps> & {
  bindings: CalendarHeaderBindings;
  el: ComponentPublicInstance | null;
};

export type CalendarHeaderSlots = {
  default(props: CalendarHeaderContext): VNode[];
};
