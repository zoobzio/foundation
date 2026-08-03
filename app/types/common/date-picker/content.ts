import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  DatePickerContentEmits as RekaDatePickerContentEmits,
  DatePickerContentProps as RekaDatePickerContentProps,
} from "reka-ui";

export type DatePickerContentForward = Reshape<RekaDatePickerContentProps>;

export type DatePickerContentProps = RekaDatePickerContentProps & {
  modifiers?: ModifierProps<"date-picker-content">;
  tokens?: TokenProps<"date-picker-content">;
  aria?: AriaProps<"date-picker-content">;
};

export type DatePickerContentEmits = RekaDatePickerContentEmits &
  ComponentEvents["date-picker-content"];

export type DatePickerContentBindings = Bindings<
  "date-picker-content",
  DatePickerContentForward
>;

export type DatePickerContentContext = Reshape<DatePickerContentProps> & {
  bindings: DatePickerContentBindings;
  el: ComponentPublicInstance | null;
};

export type DatePickerContentSlots = {
  default(props: DatePickerContentContext): VNode[];
};
