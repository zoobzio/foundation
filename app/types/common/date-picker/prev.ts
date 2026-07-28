import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { SlotProps } from "#foundation/types/slots";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  DatePickerPrev,
  DatePickerPrevProps as RekaDatePickerPrevProps,
} from "reka-ui";

export type DatePickerPrevForward = Reshape<RekaDatePickerPrevProps>;

export type DatePickerPrevProps = RekaDatePickerPrevProps & {
  modifiers?: ModifierProps<"date-picker-prev">;
  tokens?: TokenProps<"date-picker-prev">;
  aria?: AriaProps<"date-picker-prev">;
};

export type DatePickerPrevEmits = ComponentEvents["date-picker-prev"];

export type DatePickerPrevBindings = Bindings<"date-picker-prev", DatePickerPrevForward>;

export type DatePickerPrevContext = Reshape<DatePickerPrevProps> & {
  bindings: DatePickerPrevBindings;
  el: ComponentPublicInstance | null;
};

export type DatePickerPrevSlots = {
  default(props: DatePickerPrevContext & SlotProps<typeof DatePickerPrev>): VNode[];
};
