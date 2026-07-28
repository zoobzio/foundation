import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DateRangePickerGridProps as RekaDateRangePickerGridProps } from "reka-ui";

export type DateRangePickerGridForward = Reshape<RekaDateRangePickerGridProps>;

export type DateRangePickerGridProps = RekaDateRangePickerGridProps & {
  modifiers?: ModifierProps<"date-range-picker-grid">;
  tokens?: TokenProps<"date-range-picker-grid">;
  aria?: AriaProps<"date-range-picker-grid">;
};

export type DateRangePickerGridEmits = ComponentEvents["date-range-picker-grid"];

export type DateRangePickerGridBindings = Bindings<"date-range-picker-grid", DateRangePickerGridForward>;

export type DateRangePickerGridContext = Reshape<DateRangePickerGridProps> & {
  bindings: DateRangePickerGridBindings;
  el: ComponentPublicInstance | null;
};

export type DateRangePickerGridSlots = {
  default(props: DateRangePickerGridContext): VNode[];
};
