import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DatePickerGridHeadProps as RekaDatePickerGridHeadProps } from "reka-ui";

export type DatePickerGridHeadForward = Reshape<RekaDatePickerGridHeadProps>;

export type DatePickerGridHeadProps = RekaDatePickerGridHeadProps & {
  modifiers?: ModifierProps<"date-picker-grid-head">;
  tokens?: TokenProps<"date-picker-grid-head">;
  aria?: AriaProps<"date-picker-grid-head">;
};

export type DatePickerGridHeadEmits = ComponentEvents["date-picker-grid-head"];

export type DatePickerGridHeadBindings = Bindings<"date-picker-grid-head", DatePickerGridHeadForward>;

export type DatePickerGridHeadContext = Reshape<DatePickerGridHeadProps> & {
  bindings: DatePickerGridHeadBindings;
  el: ComponentPublicInstance | null;
};

export type DatePickerGridHeadSlots = {
  default(props: DatePickerGridHeadContext): VNode[];
};
