import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { SlotProps } from "#foundation/types/slots";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  CalendarNext,
  CalendarNextProps as RekaCalendarNextProps,
} from "reka-ui";

export type CalendarNextForward = Reshape<RekaCalendarNextProps>;

export type CalendarNextProps = RekaCalendarNextProps & {
  modifiers?: ModifierProps<"calendar-next">;
  tokens?: TokenProps<"calendar-next">;
  aria?: AriaProps<"calendar-next">;
};

export type CalendarNextEmits = ComponentEvents["calendar-next"];

export type CalendarNextBindings = Bindings<"calendar-next", CalendarNextForward>;

export type CalendarNextContext = Reshape<CalendarNextProps> & {
  bindings: CalendarNextBindings;
  el: ComponentPublicInstance | null;
};

export type CalendarNextSlots = {
  default(props: CalendarNextContext & SlotProps<typeof CalendarNext>): VNode[];
};
