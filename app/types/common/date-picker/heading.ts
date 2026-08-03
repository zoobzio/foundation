import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { SlotProps } from "#foundation/types/slots";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  DatePickerHeading,
  DatePickerHeadingProps as RekaDatePickerHeadingProps,
} from "reka-ui";

export type DatePickerHeadingForward = Reshape<RekaDatePickerHeadingProps>;

export type DatePickerHeadingProps = RekaDatePickerHeadingProps & {
  modifiers?: ModifierProps<"date-picker-heading">;
  tokens?: TokenProps<"date-picker-heading">;
  aria?: AriaProps<"date-picker-heading">;
};

export type DatePickerHeadingEmits = ComponentEvents["date-picker-heading"];

export type DatePickerHeadingBindings = Bindings<"date-picker-heading", DatePickerHeadingForward>;

export type DatePickerHeadingContext = Reshape<DatePickerHeadingProps> & {
  bindings: DatePickerHeadingBindings;
  el: ComponentPublicInstance | null;
};

export type DatePickerHeadingSlots = {
  default(props: DatePickerHeadingContext & SlotProps<typeof DatePickerHeading>): VNode[];
};
