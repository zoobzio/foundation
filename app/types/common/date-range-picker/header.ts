import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DateRangePickerHeaderProps as RekaDateRangePickerHeaderProps } from "reka-ui";

export type DateRangePickerHeaderForward = Reshape<RekaDateRangePickerHeaderProps>;

export type DateRangePickerHeaderProps = RekaDateRangePickerHeaderProps & {
  modifiers?: ModifierProps<"date-range-picker-header">;
  tokens?: TokenProps<"date-range-picker-header">;
  aria?: AriaProps<"date-range-picker-header">;
};

export type DateRangePickerHeaderEmits = {};

export type DateRangePickerHeaderBindings = Bindings<"date-range-picker-header", DateRangePickerHeaderForward>;

export type DateRangePickerHeaderContext = Reshape<DateRangePickerHeaderProps> & {
  bindings: DateRangePickerHeaderBindings;
  el: ComponentPublicInstance | null;
};

export type DateRangePickerHeaderSlots = {
  default(props: DateRangePickerHeaderContext): VNode[];
};
