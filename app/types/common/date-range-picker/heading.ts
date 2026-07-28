import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { SlotProps } from "#foundation/types/slots";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  DateRangePickerHeading,
  DateRangePickerHeadingProps as RekaDateRangePickerHeadingProps,
} from "reka-ui";

export type DateRangePickerHeadingForward = Reshape<RekaDateRangePickerHeadingProps>;

export type DateRangePickerHeadingProps = RekaDateRangePickerHeadingProps & {
  modifiers?: ModifierProps<"date-range-picker-heading">;
  tokens?: TokenProps<"date-range-picker-heading">;
  aria?: AriaProps<"date-range-picker-heading">;
};

export type DateRangePickerHeadingEmits = ComponentEvents["date-range-picker-heading"];

export type DateRangePickerHeadingBindings = Bindings<"date-range-picker-heading", DateRangePickerHeadingForward>;

export type DateRangePickerHeadingContext = Reshape<DateRangePickerHeadingProps> & {
  bindings: DateRangePickerHeadingBindings;
  el: ComponentPublicInstance | null;
};

export type DateRangePickerHeadingSlots = {
  default(props: DateRangePickerHeadingContext & SlotProps<typeof DateRangePickerHeading>): VNode[];
};
