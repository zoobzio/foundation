import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { SlotProps } from "../../slots";
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
