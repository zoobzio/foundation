import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DateRangePickerGridHeadProps as RekaDateRangePickerGridHeadProps } from "reka-ui";

export type DateRangePickerGridHeadForward = Reshape<RekaDateRangePickerGridHeadProps>;

export type DateRangePickerGridHeadProps = RekaDateRangePickerGridHeadProps & {
  modifiers?: ModifierProps<"date-range-picker-grid-head">;
  tokens?: TokenProps<"date-range-picker-grid-head">;
  aria?: AriaProps<"date-range-picker-grid-head">;
};

export type DateRangePickerGridHeadEmits = ComponentEvents["date-range-picker-grid-head"];

export type DateRangePickerGridHeadBindings = Bindings<"date-range-picker-grid-head", DateRangePickerGridHeadForward>;

export type DateRangePickerGridHeadContext = Reshape<DateRangePickerGridHeadProps> & {
  bindings: DateRangePickerGridHeadBindings;
  el: ComponentPublicInstance | null;
};

export type DateRangePickerGridHeadSlots = {
  default(props: DateRangePickerGridHeadContext): VNode[];
};
