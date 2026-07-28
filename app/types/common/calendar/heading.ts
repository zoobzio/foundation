import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { SlotProps } from "#foundation/types/slots";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  CalendarHeading,
  CalendarHeadingProps as RekaCalendarHeadingProps,
} from "reka-ui";

export type CalendarHeadingForward = Reshape<RekaCalendarHeadingProps>;

export type CalendarHeadingProps = RekaCalendarHeadingProps & {
  modifiers?: ModifierProps<"calendar-heading">;
  tokens?: TokenProps<"calendar-heading">;
  aria?: AriaProps<"calendar-heading">;
};

export type CalendarHeadingEmits = ComponentEvents["calendar-heading"];

export type CalendarHeadingBindings = Bindings<"calendar-heading", CalendarHeadingForward>;

export type CalendarHeadingContext = Reshape<CalendarHeadingProps> & {
  bindings: CalendarHeadingBindings;
  el: ComponentPublicInstance | null;
};

export type CalendarHeadingSlots = {
  default(props: CalendarHeadingContext & SlotProps<typeof CalendarHeading>): VNode[];
};
