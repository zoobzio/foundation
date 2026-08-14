import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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
