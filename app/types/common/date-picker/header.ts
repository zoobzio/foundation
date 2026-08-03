import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DatePickerHeaderProps as RekaDatePickerHeaderProps } from "reka-ui";

export type DatePickerHeaderForward = Reshape<RekaDatePickerHeaderProps>;

export type DatePickerHeaderProps = RekaDatePickerHeaderProps & {
  modifiers?: ModifierProps<"date-picker-header">;
  tokens?: TokenProps<"date-picker-header">;
  aria?: AriaProps<"date-picker-header">;
};

export type DatePickerHeaderEmits = ComponentEvents["date-picker-header"];

export type DatePickerHeaderBindings = Bindings<"date-picker-header", DatePickerHeaderForward>;

export type DatePickerHeaderContext = Reshape<DatePickerHeaderProps> & {
  bindings: DatePickerHeaderBindings;
  el: ComponentPublicInstance | null;
};

export type DatePickerHeaderSlots = {
  default(props: DatePickerHeaderContext): VNode[];
};
