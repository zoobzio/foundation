import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { SlotProps } from "#foundation/types/slots";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  CalendarPrev,
  CalendarPrevProps as RekaCalendarPrevProps,
} from "reka-ui";

export type CalendarPrevForward = Reshape<RekaCalendarPrevProps>;

export type CalendarPrevProps = RekaCalendarPrevProps & {
  modifiers?: ModifierProps<"calendar-prev">;
  tokens?: TokenProps<"calendar-prev">;
  aria?: AriaProps<"calendar-prev">;
};

export type CalendarPrevEmits = ComponentEvents["calendar-prev"];

export type CalendarPrevBindings = Bindings<"calendar-prev", CalendarPrevForward>;

export type CalendarPrevContext = Reshape<CalendarPrevProps> & {
  bindings: CalendarPrevBindings;
  el: ComponentPublicInstance | null;
};

export type CalendarPrevSlots = {
  default(props: CalendarPrevContext & SlotProps<typeof CalendarPrev>): VNode[];
};
