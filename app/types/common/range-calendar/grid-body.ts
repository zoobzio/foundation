import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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
