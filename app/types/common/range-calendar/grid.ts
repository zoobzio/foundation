import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { RangeCalendarGridProps as RekaRangeCalendarGridProps } from "reka-ui";

export type RangeCalendarGridForward = Reshape<RekaRangeCalendarGridProps>;

export type RangeCalendarGridProps = RekaRangeCalendarGridProps & {
  modifiers?: ModifierProps<"range-calendar-grid">;
  tokens?: TokenProps<"range-calendar-grid">;
  aria?: AriaProps<"range-calendar-grid">;
};

export type RangeCalendarGridEmits = {};

export type RangeCalendarGridBindings = Bindings<"range-calendar-grid", RangeCalendarGridForward>;

export type RangeCalendarGridContext = Reshape<RangeCalendarGridProps> & {
  bindings: RangeCalendarGridBindings;
  el: ComponentPublicInstance | null;
};

export type RangeCalendarGridSlots = {
  default(props: RangeCalendarGridContext): VNode[];
};
