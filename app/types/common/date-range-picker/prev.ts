import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { SlotProps } from "../../slots";
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
