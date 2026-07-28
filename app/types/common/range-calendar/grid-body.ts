import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { RangeCalendarGridBodyProps as RekaRangeCalendarGridBodyProps } from "reka-ui";

export type RangeCalendarGridBodyForward = Reshape<RekaRangeCalendarGridBodyProps>;

export type RangeCalendarGridBodyProps = RekaRangeCalendarGridBodyProps & {
  modifiers?: ModifierProps<"range-calendar-grid-body">;
  tokens?: TokenProps<"range-calendar-grid-body">;
  aria?: AriaProps<"range-calendar-grid-body">;
};

export type RangeCalendarGridBodyEmits = ComponentEvents["range-calendar-grid-body"];

export type RangeCalendarGridBodyBindings = Bindings<"range-calendar-grid-body", RangeCalendarGridBodyForward>;

export type RangeCalendarGridBodyContext = Reshape<RangeCalendarGridBodyProps> & {
  bindings: RangeCalendarGridBodyBindings;
  el: ComponentPublicInstance | null;
};

export type RangeCalendarGridBodySlots = {
  default(props: RangeCalendarGridBodyContext): VNode[];
};
