import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DatePickerGridBodyProps as RekaDatePickerGridBodyProps } from "reka-ui";

export type DatePickerGridBodyForward = Reshape<RekaDatePickerGridBodyProps>;

export type DatePickerGridBodyProps = RekaDatePickerGridBodyProps & {
  modifiers?: ModifierProps<"date-picker-grid-body">;
  tokens?: TokenProps<"date-picker-grid-body">;
  aria?: AriaProps<"date-picker-grid-body">;
};

export type DatePickerGridBodyEmits = {};

export type DatePickerGridBodyBindings = Bindings<"date-picker-grid-body", DatePickerGridBodyForward>;

export type DatePickerGridBodyContext = Reshape<DatePickerGridBodyProps> & {
  bindings: DatePickerGridBodyBindings;
  el: ComponentPublicInstance | null;
};

export type DatePickerGridBodySlots = {
  default(props: DatePickerGridBodyContext): VNode[];
};
