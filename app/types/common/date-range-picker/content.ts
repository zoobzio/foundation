import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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
  ComponentEvents["date-range-picker-content"];

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
