import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { SlotProps } from "../../slots";
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
