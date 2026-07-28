import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { SlotProps } from "#foundation/types/slots";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  DateRangePickerNext,
  DateRangePickerNextProps as RekaDateRangePickerNextProps,
} from "reka-ui";

export type DateRangePickerNextForward = Reshape<RekaDateRangePickerNextProps>;

export type DateRangePickerNextProps = RekaDateRangePickerNextProps & {
  modifiers?: ModifierProps<"date-range-picker-next">;
  tokens?: TokenProps<"date-range-picker-next">;
  aria?: AriaProps<"date-range-picker-next">;
};

export type DateRangePickerNextEmits = ComponentEvents["date-range-picker-next"];

export type DateRangePickerNextBindings = Bindings<"date-range-picker-next", DateRangePickerNextForward>;

export type DateRangePickerNextContext = Reshape<DateRangePickerNextProps> & {
  bindings: DateRangePickerNextBindings;
  el: ComponentPublicInstance | null;
};

export type DateRangePickerNextSlots = {
  default(props: DateRangePickerNextContext & SlotProps<typeof DateRangePickerNext>): VNode[];
};
