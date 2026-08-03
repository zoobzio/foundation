import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DatePickerGridBodyProps as RekaDatePickerGridBodyProps } from "reka-ui";

export type DatePickerGridBodyForward = Reshape<RekaDatePickerGridBodyProps>;

export type DatePickerGridBodyProps = RekaDatePickerGridBodyProps & {
  modifiers?: ModifierProps<"date-picker-grid-body">;
  tokens?: TokenProps<"date-picker-grid-body">;
  aria?: AriaProps<"date-picker-grid-body">;
};

export type DatePickerGridBodyEmits = ComponentEvents["date-picker-grid-body"];

export type DatePickerGridBodyBindings = Bindings<"date-picker-grid-body", DatePickerGridBodyForward>;

export type DatePickerGridBodyContext = Reshape<DatePickerGridBodyProps> & {
  bindings: DatePickerGridBodyBindings;
  el: ComponentPublicInstance | null;
};

export type DatePickerGridBodySlots = {
  default(props: DatePickerGridBodyContext): VNode[];
};
