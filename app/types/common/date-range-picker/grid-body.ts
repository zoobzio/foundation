import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DateRangePickerGridBodyProps as RekaDateRangePickerGridBodyProps } from "reka-ui";

export type DateRangePickerGridBodyForward = Reshape<RekaDateRangePickerGridBodyProps>;

export type DateRangePickerGridBodyProps = RekaDateRangePickerGridBodyProps & {
  modifiers?: ModifierProps<"date-range-picker-grid-body">;
  tokens?: TokenProps<"date-range-picker-grid-body">;
  aria?: AriaProps<"date-range-picker-grid-body">;
};

export type DateRangePickerGridBodyEmits = {};

export type DateRangePickerGridBodyBindings = Bindings<"date-range-picker-grid-body", DateRangePickerGridBodyForward>;

export type DateRangePickerGridBodyContext = Reshape<DateRangePickerGridBodyProps> & {
  bindings: DateRangePickerGridBodyBindings;
  el: ComponentPublicInstance | null;
};

export type DateRangePickerGridBodySlots = {
  default(props: DateRangePickerGridBodyContext): VNode[];
};
