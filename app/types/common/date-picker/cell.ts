import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DatePickerCellProps as RekaDatePickerCellProps } from "reka-ui";

export type DatePickerCellForward = Reshape<RekaDatePickerCellProps>;

export type DatePickerCellProps = RekaDatePickerCellProps & {
  modifiers?: ModifierProps<"date-picker-cell">;
  tokens?: TokenProps<"date-picker-cell">;
  aria?: AriaProps<"date-picker-cell">;
};

export type DatePickerCellEmits = ComponentEvents["date-picker-cell"];

export type DatePickerCellBindings = Bindings<"date-picker-cell", DatePickerCellForward>;

export type DatePickerCellContext = Reshape<DatePickerCellProps> & {
  bindings: DatePickerCellBindings;
  el: ComponentPublicInstance | null;
};

export type DatePickerCellSlots = {
  default(props: DatePickerCellContext): VNode[];
};
