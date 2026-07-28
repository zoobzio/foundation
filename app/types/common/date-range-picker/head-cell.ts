import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DateRangePickerHeadCellProps as RekaDateRangePickerHeadCellProps } from "reka-ui";

export type DateRangePickerHeadCellForward = Reshape<RekaDateRangePickerHeadCellProps>;

export type DateRangePickerHeadCellProps = RekaDateRangePickerHeadCellProps & {
  modifiers?: ModifierProps<"date-range-picker-head-cell">;
  tokens?: TokenProps<"date-range-picker-head-cell">;
  aria?: AriaProps<"date-range-picker-head-cell">;
};

export type DateRangePickerHeadCellEmits = ComponentEvents["date-range-picker-head-cell"];

export type DateRangePickerHeadCellBindings = Bindings<"date-range-picker-head-cell", DateRangePickerHeadCellForward>;

export type DateRangePickerHeadCellContext = Reshape<DateRangePickerHeadCellProps> & {
  bindings: DateRangePickerHeadCellBindings;
  el: ComponentPublicInstance | null;
};

export type DateRangePickerHeadCellSlots = {
  default(props: DateRangePickerHeadCellContext): VNode[];
};
