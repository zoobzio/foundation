import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { SlotProps } from "../../slots";
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
