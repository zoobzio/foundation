import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { SlotProps } from "#foundation/types/slots";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  DatePickerNext,
  DatePickerNextProps as RekaDatePickerNextProps,
} from "reka-ui";

export type DatePickerNextForward = Reshape<RekaDatePickerNextProps>;

export type DatePickerNextProps = RekaDatePickerNextProps & {
  modifiers?: ModifierProps<"date-picker-next">;
  tokens?: TokenProps<"date-picker-next">;
  aria?: AriaProps<"date-picker-next">;
};

export type DatePickerNextEmits = ComponentEvents["date-picker-next"];

export type DatePickerNextBindings = Bindings<"date-picker-next", DatePickerNextForward>;

export type DatePickerNextContext = Reshape<DatePickerNextProps> & {
  bindings: DatePickerNextBindings;
  el: ComponentPublicInstance | null;
};

export type DatePickerNextSlots = {
  default(props: DatePickerNextContext & SlotProps<typeof DatePickerNext>): VNode[];
};
