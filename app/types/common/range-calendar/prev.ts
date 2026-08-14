import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { SlotProps } from "../../slots";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  RangeCalendarPrev,
  RangeCalendarPrevProps as RekaRangeCalendarPrevProps,
} from "reka-ui";

export type RangeCalendarPrevForward = Reshape<RekaRangeCalendarPrevProps>;

export type RangeCalendarPrevProps = RekaRangeCalendarPrevProps & {
  modifiers?: ModifierProps<"range-calendar-prev">;
  tokens?: TokenProps<"range-calendar-prev">;
  aria?: AriaProps<"range-calendar-prev">;
};

export type RangeCalendarPrevEmits = ComponentEvents["range-calendar-prev"];

export type RangeCalendarPrevBindings = Bindings<"range-calendar-prev", RangeCalendarPrevForward>;

export type RangeCalendarPrevContext = Reshape<RangeCalendarPrevProps> & {
  bindings: RangeCalendarPrevBindings;
  el: ComponentPublicInstance | null;
};

export type RangeCalendarPrevSlots = {
  default(props: RangeCalendarPrevContext & SlotProps<typeof RangeCalendarPrev>): VNode[];
};
