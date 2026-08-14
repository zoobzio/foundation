import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { SlotProps } from "../../slots";
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
