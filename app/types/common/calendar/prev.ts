import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { SlotProps } from "../../slots";
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
