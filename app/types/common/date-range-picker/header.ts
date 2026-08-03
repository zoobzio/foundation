import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DateRangePickerHeaderProps as RekaDateRangePickerHeaderProps } from "reka-ui";

export type DateRangePickerHeaderForward = Reshape<RekaDateRangePickerHeaderProps>;

export type DateRangePickerHeaderProps = RekaDateRangePickerHeaderProps & {
  modifiers?: ModifierProps<"date-range-picker-header">;
  tokens?: TokenProps<"date-range-picker-header">;
  aria?: AriaProps<"date-range-picker-header">;
};

export type DateRangePickerHeaderEmits = ComponentEvents["date-range-picker-header"];

export type DateRangePickerHeaderBindings = Bindings<"date-range-picker-header", DateRangePickerHeaderForward>;

export type DateRangePickerHeaderContext = Reshape<DateRangePickerHeaderProps> & {
  bindings: DateRangePickerHeaderBindings;
  el: ComponentPublicInstance | null;
};

export type DateRangePickerHeaderSlots = {
  default(props: DateRangePickerHeaderContext): VNode[];
};
