import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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
  {};

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
