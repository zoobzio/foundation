import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { EventEmits } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { SlotProps } from "../../slots";
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

export type DateRangePickerNextEmits = EventEmits<"click">;

export type DateRangePickerNextBindings = Bindings<"date-range-picker-next", DateRangePickerNextForward>;

export type DateRangePickerNextContext = Reshape<DateRangePickerNextProps> & {
  bindings: DateRangePickerNextBindings;
  el: ComponentPublicInstance | null;
};

export type DateRangePickerNextSlots = {
  default(props: DateRangePickerNextContext & SlotProps<typeof DateRangePickerNext>): VNode[];
};
