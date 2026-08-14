import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DatePickerGridHeadProps as RekaDatePickerGridHeadProps } from "reka-ui";

export type DatePickerGridHeadForward = Reshape<RekaDatePickerGridHeadProps>;

export type DatePickerGridHeadProps = RekaDatePickerGridHeadProps & {
  modifiers?: ModifierProps<"date-picker-grid-head">;
  tokens?: TokenProps<"date-picker-grid-head">;
  aria?: AriaProps<"date-picker-grid-head">;
};

export type DatePickerGridHeadEmits = {};

export type DatePickerGridHeadBindings = Bindings<"date-picker-grid-head", DatePickerGridHeadForward>;

export type DatePickerGridHeadContext = Reshape<DatePickerGridHeadProps> & {
  bindings: DatePickerGridHeadBindings;
  el: ComponentPublicInstance | null;
};

export type DatePickerGridHeadSlots = {
  default(props: DatePickerGridHeadContext): VNode[];
};
