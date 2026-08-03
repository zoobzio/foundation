import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { RangeCalendarCellProps as RekaRangeCalendarCellProps } from "reka-ui";

export type RangeCalendarCellForward = Reshape<RekaRangeCalendarCellProps>;

export type RangeCalendarCellProps = RekaRangeCalendarCellProps & {
  modifiers?: ModifierProps<"range-calendar-cell">;
  tokens?: TokenProps<"range-calendar-cell">;
  aria?: AriaProps<"range-calendar-cell">;
};

export type RangeCalendarCellEmits = ComponentEvents["range-calendar-cell"];

export type RangeCalendarCellBindings = Bindings<"range-calendar-cell", RangeCalendarCellForward>;

export type RangeCalendarCellContext = Reshape<RangeCalendarCellProps> & {
  bindings: RangeCalendarCellBindings;
  el: ComponentPublicInstance | null;
};

export type RangeCalendarCellSlots = {
  default(props: RangeCalendarCellContext): VNode[];
};
