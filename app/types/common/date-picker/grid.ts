import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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
