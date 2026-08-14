import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { SlotProps } from "../../slots";
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
