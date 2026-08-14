import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { SlotProps } from "../../slots";
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
