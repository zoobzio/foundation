import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DateRangePickerGridProps as RekaDateRangePickerGridProps } from "reka-ui";

export type DateRangePickerGridForward = Reshape<RekaDateRangePickerGridProps>;

export type DateRangePickerGridProps = RekaDateRangePickerGridProps & {
  modifiers?: ModifierProps<"date-range-picker-grid">;
  tokens?: TokenProps<"date-range-picker-grid">;
  aria?: AriaProps<"date-range-picker-grid">;
};

export type DateRangePickerGridEmits = {};

export type DateRangePickerGridBindings = Bindings<"date-range-picker-grid", DateRangePickerGridForward>;

export type DateRangePickerGridContext = Reshape<DateRangePickerGridProps> & {
  bindings: DateRangePickerGridBindings;
  el: ComponentPublicInstance | null;
};

export type DateRangePickerGridSlots = {
  default(props: DateRangePickerGridContext): VNode[];
};
