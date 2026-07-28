import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DatePickerGridRowProps as RekaDatePickerGridRowProps } from "reka-ui";

export type DatePickerGridRowForward = Reshape<RekaDatePickerGridRowProps>;

export type DatePickerGridRowProps = RekaDatePickerGridRowProps & {
  modifiers?: ModifierProps<"date-picker-grid-row">;
  tokens?: TokenProps<"date-picker-grid-row">;
  aria?: AriaProps<"date-picker-grid-row">;
};

export type DatePickerGridRowEmits = ComponentEvents["date-picker-grid-row"];

export type DatePickerGridRowBindings = Bindings<"date-picker-grid-row", DatePickerGridRowForward>;

export type DatePickerGridRowContext = Reshape<DatePickerGridRowProps> & {
  bindings: DatePickerGridRowBindings;
  el: ComponentPublicInstance | null;
};

export type DatePickerGridRowSlots = {
  default(props: DatePickerGridRowContext): VNode[];
};
