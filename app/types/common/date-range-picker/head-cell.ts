import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DateRangePickerHeadCellProps as RekaDateRangePickerHeadCellProps } from "reka-ui";

export type DateRangePickerHeadCellForward = Reshape<RekaDateRangePickerHeadCellProps>;

export type DateRangePickerHeadCellProps = RekaDateRangePickerHeadCellProps & {
  modifiers?: ModifierProps<"date-range-picker-head-cell">;
  tokens?: TokenProps<"date-range-picker-head-cell">;
  aria?: AriaProps<"date-range-picker-head-cell">;
};

export type DateRangePickerHeadCellEmits = {};

export type DateRangePickerHeadCellBindings = Bindings<"date-range-picker-head-cell", DateRangePickerHeadCellForward>;

export type DateRangePickerHeadCellContext = Reshape<DateRangePickerHeadCellProps> & {
  bindings: DateRangePickerHeadCellBindings;
  el: ComponentPublicInstance | null;
};

export type DateRangePickerHeadCellSlots = {
  default(props: DateRangePickerHeadCellContext): VNode[];
};
