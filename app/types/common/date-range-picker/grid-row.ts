import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DateRangePickerGridRowProps as RekaDateRangePickerGridRowProps } from "reka-ui";

export type DateRangePickerGridRowForward = Reshape<RekaDateRangePickerGridRowProps>;

export type DateRangePickerGridRowProps = RekaDateRangePickerGridRowProps & {
  modifiers?: ModifierProps<"date-range-picker-grid-row">;
  tokens?: TokenProps<"date-range-picker-grid-row">;
  aria?: AriaProps<"date-range-picker-grid-row">;
};

export type DateRangePickerGridRowEmits = ComponentEvents["date-range-picker-grid-row"];

export type DateRangePickerGridRowBindings = Bindings<"date-range-picker-grid-row", DateRangePickerGridRowForward>;

export type DateRangePickerGridRowContext = Reshape<DateRangePickerGridRowProps> & {
  bindings: DateRangePickerGridRowBindings;
  el: ComponentPublicInstance | null;
};

export type DateRangePickerGridRowSlots = {
  default(props: DateRangePickerGridRowContext): VNode[];
};
