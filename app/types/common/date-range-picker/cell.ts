import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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
