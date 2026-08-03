import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DateRangePickerGridBodyProps as RekaDateRangePickerGridBodyProps } from "reka-ui";

export type DateRangePickerGridBodyForward = Reshape<RekaDateRangePickerGridBodyProps>;

export type DateRangePickerGridBodyProps = RekaDateRangePickerGridBodyProps & {
  modifiers?: ModifierProps<"date-range-picker-grid-body">;
  tokens?: TokenProps<"date-range-picker-grid-body">;
  aria?: AriaProps<"date-range-picker-grid-body">;
};

export type DateRangePickerGridBodyEmits = ComponentEvents["date-range-picker-grid-body"];

export type DateRangePickerGridBodyBindings = Bindings<"date-range-picker-grid-body", DateRangePickerGridBodyForward>;

export type DateRangePickerGridBodyContext = Reshape<DateRangePickerGridBodyProps> & {
  bindings: DateRangePickerGridBodyBindings;
  el: ComponentPublicInstance | null;
};

export type DateRangePickerGridBodySlots = {
  default(props: DateRangePickerGridBodyContext): VNode[];
};
