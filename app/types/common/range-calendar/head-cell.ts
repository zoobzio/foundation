import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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
