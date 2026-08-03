import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { RangeCalendarHeadCellProps as RekaRangeCalendarHeadCellProps } from "reka-ui";

export type RangeCalendarHeadCellForward = Reshape<RekaRangeCalendarHeadCellProps>;

export type RangeCalendarHeadCellProps = RekaRangeCalendarHeadCellProps & {
  modifiers?: ModifierProps<"range-calendar-head-cell">;
  tokens?: TokenProps<"range-calendar-head-cell">;
  aria?: AriaProps<"range-calendar-head-cell">;
};

export type RangeCalendarHeadCellEmits = ComponentEvents["range-calendar-head-cell"];

export type RangeCalendarHeadCellBindings = Bindings<"range-calendar-head-cell", RangeCalendarHeadCellForward>;

export type RangeCalendarHeadCellContext = Reshape<RangeCalendarHeadCellProps> & {
  bindings: RangeCalendarHeadCellBindings;
  el: ComponentPublicInstance | null;
};

export type RangeCalendarHeadCellSlots = {
  default(props: RangeCalendarHeadCellContext): VNode[];
};
