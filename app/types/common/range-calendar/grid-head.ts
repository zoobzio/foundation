import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { RangeCalendarGridHeadProps as RekaRangeCalendarGridHeadProps } from "reka-ui";

export type RangeCalendarGridHeadForward = Reshape<RekaRangeCalendarGridHeadProps>;

export type RangeCalendarGridHeadProps = RekaRangeCalendarGridHeadProps & {
  modifiers?: ModifierProps<"range-calendar-grid-head">;
  tokens?: TokenProps<"range-calendar-grid-head">;
  aria?: AriaProps<"range-calendar-grid-head">;
};

export type RangeCalendarGridHeadEmits = {};

export type RangeCalendarGridHeadBindings = Bindings<"range-calendar-grid-head", RangeCalendarGridHeadForward>;

export type RangeCalendarGridHeadContext = Reshape<RangeCalendarGridHeadProps> & {
  bindings: RangeCalendarGridHeadBindings;
  el: ComponentPublicInstance | null;
};

export type RangeCalendarGridHeadSlots = {
  default(props: RangeCalendarGridHeadContext): VNode[];
};
