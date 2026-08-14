import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DatePickerCellProps as RekaDatePickerCellProps } from "reka-ui";

export type DatePickerCellForward = Reshape<RekaDatePickerCellProps>;

export type DatePickerCellProps = RekaDatePickerCellProps & {
  modifiers?: ModifierProps<"date-picker-cell">;
  tokens?: TokenProps<"date-picker-cell">;
  aria?: AriaProps<"date-picker-cell">;
};

export type DatePickerCellEmits = {};

export type DatePickerCellBindings = Bindings<"date-picker-cell", DatePickerCellForward>;

export type DatePickerCellContext = Reshape<DatePickerCellProps> & {
  bindings: DatePickerCellBindings;
  el: ComponentPublicInstance | null;
};

export type DatePickerCellSlots = {
  default(props: DatePickerCellContext): VNode[];
};
