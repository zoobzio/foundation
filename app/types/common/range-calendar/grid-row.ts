import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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
