import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { SlotProps } from "../../slots";
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
