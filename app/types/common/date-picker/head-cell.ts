import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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
