import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DatePickerGridProps as RekaDatePickerGridProps } from "reka-ui";

export type DatePickerGridForward = Reshape<RekaDatePickerGridProps>;

export type DatePickerGridProps = RekaDatePickerGridProps & {
  modifiers?: ModifierProps<"date-picker-grid">;
  tokens?: TokenProps<"date-picker-grid">;
  aria?: AriaProps<"date-picker-grid">;
};

export type DatePickerGridEmits = ComponentEvents["date-picker-grid"];

export type DatePickerGridBindings = Bindings<"date-picker-grid", DatePickerGridForward>;

export type DatePickerGridContext = Reshape<DatePickerGridProps> & {
  bindings: DatePickerGridBindings;
  el: ComponentPublicInstance | null;
};

export type DatePickerGridSlots = {
  default(props: DatePickerGridContext): VNode[];
};
