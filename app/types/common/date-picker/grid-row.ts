import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DatePickerGridRowProps as RekaDatePickerGridRowProps } from "reka-ui";

export type DatePickerGridRowForward = Reshape<RekaDatePickerGridRowProps>;

export type DatePickerGridRowProps = RekaDatePickerGridRowProps & {
  modifiers?: ModifierProps<"date-picker-grid-row">;
  tokens?: TokenProps<"date-picker-grid-row">;
  aria?: AriaProps<"date-picker-grid-row">;
};

export type DatePickerGridRowEmits = {};

export type DatePickerGridRowBindings = Bindings<"date-picker-grid-row", DatePickerGridRowForward>;

export type DatePickerGridRowContext = Reshape<DatePickerGridRowProps> & {
  bindings: DatePickerGridRowBindings;
  el: ComponentPublicInstance | null;
};

export type DatePickerGridRowSlots = {
  default(props: DatePickerGridRowContext): VNode[];
};
