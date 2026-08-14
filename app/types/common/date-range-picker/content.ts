import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  DateRangePickerContentEmits as RekaDateRangePickerContentEmits,
  DateRangePickerContentProps as RekaDateRangePickerContentProps,
} from "reka-ui";

export type DateRangePickerContentForward = Reshape<RekaDateRangePickerContentProps>;

export type DateRangePickerContentProps = RekaDateRangePickerContentProps & {
  modifiers?: ModifierProps<"date-range-picker-content">;
  tokens?: TokenProps<"date-range-picker-content">;
  aria?: AriaProps<"date-range-picker-content">;
};

export type DateRangePickerContentEmits = RekaDateRangePickerContentEmits &
  {};

export type DateRangePickerContentBindings = Bindings<
  "date-range-picker-content",
  DateRangePickerContentForward
>;

export type DateRangePickerContentContext = Reshape<DateRangePickerContentProps> & {
  bindings: DateRangePickerContentBindings;
  el: ComponentPublicInstance | null;
};

export type DateRangePickerContentSlots = {
  default(props: DateRangePickerContentContext): VNode[];
};
