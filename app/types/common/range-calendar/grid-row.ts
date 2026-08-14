import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { RangeCalendarGridRowProps as RekaRangeCalendarGridRowProps } from "reka-ui";

export type RangeCalendarGridRowForward = Reshape<RekaRangeCalendarGridRowProps>;

export type RangeCalendarGridRowProps = RekaRangeCalendarGridRowProps & {
  modifiers?: ModifierProps<"range-calendar-grid-row">;
  tokens?: TokenProps<"range-calendar-grid-row">;
  aria?: AriaProps<"range-calendar-grid-row">;
};

export type RangeCalendarGridRowEmits = ComponentEvents["range-calendar-grid-row"];

export type RangeCalendarGridRowBindings = Bindings<"range-calendar-grid-row", RangeCalendarGridRowForward>;

export type RangeCalendarGridRowContext = Reshape<RangeCalendarGridRowProps> & {
  bindings: RangeCalendarGridRowBindings;
  el: ComponentPublicInstance | null;
};

export type RangeCalendarGridRowSlots = {
  default(props: RangeCalendarGridRowContext): VNode[];
};
