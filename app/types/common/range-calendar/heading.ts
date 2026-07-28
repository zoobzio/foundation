import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { SlotProps } from "#foundation/types/slots";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  RangeCalendarHeading,
  RangeCalendarHeadingProps as RekaRangeCalendarHeadingProps,
} from "reka-ui";

export type RangeCalendarHeadingForward = Reshape<RekaRangeCalendarHeadingProps>;

export type RangeCalendarHeadingProps = RekaRangeCalendarHeadingProps & {
  modifiers?: ModifierProps<"range-calendar-heading">;
  tokens?: TokenProps<"range-calendar-heading">;
  aria?: AriaProps<"range-calendar-heading">;
};

export type RangeCalendarHeadingEmits = ComponentEvents["range-calendar-heading"];

export type RangeCalendarHeadingBindings = Bindings<"range-calendar-heading", RangeCalendarHeadingForward>;

export type RangeCalendarHeadingContext = Reshape<RangeCalendarHeadingProps> & {
  bindings: RangeCalendarHeadingBindings;
  el: ComponentPublicInstance | null;
};

export type RangeCalendarHeadingSlots = {
  default(props: RangeCalendarHeadingContext & SlotProps<typeof RangeCalendarHeading>): VNode[];
};
