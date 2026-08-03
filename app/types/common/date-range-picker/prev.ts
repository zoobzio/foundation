import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { SlotProps } from "#foundation/types/slots";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  DateRangePickerPrev,
  DateRangePickerPrevProps as RekaDateRangePickerPrevProps,
} from "reka-ui";

export type DateRangePickerPrevForward = Reshape<RekaDateRangePickerPrevProps>;

export type DateRangePickerPrevProps = RekaDateRangePickerPrevProps & {
  modifiers?: ModifierProps<"date-range-picker-prev">;
  tokens?: TokenProps<"date-range-picker-prev">;
  aria?: AriaProps<"date-range-picker-prev">;
};

export type DateRangePickerPrevEmits = ComponentEvents["date-range-picker-prev"];

export type DateRangePickerPrevBindings = Bindings<"date-range-picker-prev", DateRangePickerPrevForward>;

export type DateRangePickerPrevContext = Reshape<DateRangePickerPrevProps> & {
  bindings: DateRangePickerPrevBindings;
  el: ComponentPublicInstance | null;
};

export type DateRangePickerPrevSlots = {
  default(props: DateRangePickerPrevContext & SlotProps<typeof DateRangePickerPrev>): VNode[];
};
