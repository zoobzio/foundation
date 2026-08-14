import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { SlotProps } from "../../slots";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  RangeCalendarNext,
  RangeCalendarNextProps as RekaRangeCalendarNextProps,
} from "reka-ui";

export type RangeCalendarNextForward = Reshape<RekaRangeCalendarNextProps>;

export type RangeCalendarNextProps = RekaRangeCalendarNextProps & {
  modifiers?: ModifierProps<"range-calendar-next">;
  tokens?: TokenProps<"range-calendar-next">;
  aria?: AriaProps<"range-calendar-next">;
};

export type RangeCalendarNextEmits = ComponentEvents["range-calendar-next"];

export type RangeCalendarNextBindings = Bindings<"range-calendar-next", RangeCalendarNextForward>;

export type RangeCalendarNextContext = Reshape<RangeCalendarNextProps> & {
  bindings: RangeCalendarNextBindings;
  el: ComponentPublicInstance | null;
};

export type RangeCalendarNextSlots = {
  default(props: RangeCalendarNextContext & SlotProps<typeof RangeCalendarNext>): VNode[];
};
