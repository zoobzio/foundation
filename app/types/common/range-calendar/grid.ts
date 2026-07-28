import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { RangeCalendarGridProps as RekaRangeCalendarGridProps } from "reka-ui";

export type RangeCalendarGridForward = Reshape<RekaRangeCalendarGridProps>;

export type RangeCalendarGridProps = RekaRangeCalendarGridProps & {
  modifiers?: ModifierProps<"range-calendar-grid">;
  tokens?: TokenProps<"range-calendar-grid">;
  aria?: AriaProps<"range-calendar-grid">;
};

export type RangeCalendarGridEmits = ComponentEvents["range-calendar-grid"];

export type RangeCalendarGridBindings = Bindings<"range-calendar-grid", RangeCalendarGridForward>;

export type RangeCalendarGridContext = Reshape<RangeCalendarGridProps> & {
  bindings: RangeCalendarGridBindings;
  el: ComponentPublicInstance | null;
};

export type RangeCalendarGridSlots = {
  default(props: RangeCalendarGridContext): VNode[];
};
