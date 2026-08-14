import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DateRangePickerCellProps as RekaDateRangePickerCellProps } from "reka-ui";

export type DateRangePickerCellForward = Reshape<RekaDateRangePickerCellProps>;

export type DateRangePickerCellProps = RekaDateRangePickerCellProps & {
  modifiers?: ModifierProps<"date-range-picker-cell">;
  tokens?: TokenProps<"date-range-picker-cell">;
  aria?: AriaProps<"date-range-picker-cell">;
};

export type DateRangePickerCellEmits = ComponentEvents["date-range-picker-cell"];

export type DateRangePickerCellBindings = Bindings<"date-range-picker-cell", DateRangePickerCellForward>;

export type DateRangePickerCellContext = Reshape<DateRangePickerCellProps> & {
  bindings: DateRangePickerCellBindings;
  el: ComponentPublicInstance | null;
};

export type DateRangePickerCellSlots = {
  default(props: DateRangePickerCellContext): VNode[];
};
