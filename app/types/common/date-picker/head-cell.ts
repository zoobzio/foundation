import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DatePickerHeadCellProps as RekaDatePickerHeadCellProps } from "reka-ui";

export type DatePickerHeadCellForward = Reshape<RekaDatePickerHeadCellProps>;

export type DatePickerHeadCellProps = RekaDatePickerHeadCellProps & {
  modifiers?: ModifierProps<"date-picker-head-cell">;
  tokens?: TokenProps<"date-picker-head-cell">;
  aria?: AriaProps<"date-picker-head-cell">;
};

export type DatePickerHeadCellEmits = ComponentEvents["date-picker-head-cell"];

export type DatePickerHeadCellBindings = Bindings<"date-picker-head-cell", DatePickerHeadCellForward>;

export type DatePickerHeadCellContext = Reshape<DatePickerHeadCellProps> & {
  bindings: DatePickerHeadCellBindings;
  el: ComponentPublicInstance | null;
};

export type DatePickerHeadCellSlots = {
  default(props: DatePickerHeadCellContext): VNode[];
};
