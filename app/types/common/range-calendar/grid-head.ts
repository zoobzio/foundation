import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { RangeCalendarGridHeadProps as RekaRangeCalendarGridHeadProps } from "reka-ui";

export type RangeCalendarGridHeadForward = Reshape<RekaRangeCalendarGridHeadProps>;

export type RangeCalendarGridHeadProps = RekaRangeCalendarGridHeadProps & {
  modifiers?: ModifierProps<"range-calendar-grid-head">;
  tokens?: TokenProps<"range-calendar-grid-head">;
  aria?: AriaProps<"range-calendar-grid-head">;
};

export type RangeCalendarGridHeadEmits = ComponentEvents["range-calendar-grid-head"];

export type RangeCalendarGridHeadBindings = Bindings<"range-calendar-grid-head", RangeCalendarGridHeadForward>;

export type RangeCalendarGridHeadContext = Reshape<RangeCalendarGridHeadProps> & {
  bindings: RangeCalendarGridHeadBindings;
  el: ComponentPublicInstance | null;
};

export type RangeCalendarGridHeadSlots = {
  default(props: RangeCalendarGridHeadContext): VNode[];
};
