import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { RangeCalendarHeaderProps as RekaRangeCalendarHeaderProps } from "reka-ui";

export type RangeCalendarHeaderForward = Reshape<RekaRangeCalendarHeaderProps>;

export type RangeCalendarHeaderProps = RekaRangeCalendarHeaderProps & {
  modifiers?: ModifierProps<"range-calendar-header">;
  tokens?: TokenProps<"range-calendar-header">;
  aria?: AriaProps<"range-calendar-header">;
};

export type RangeCalendarHeaderEmits = ComponentEvents["range-calendar-header"];

export type RangeCalendarHeaderBindings = Bindings<"range-calendar-header", RangeCalendarHeaderForward>;

export type RangeCalendarHeaderContext = Reshape<RangeCalendarHeaderProps> & {
  bindings: RangeCalendarHeaderBindings;
  el: ComponentPublicInstance | null;
};

export type RangeCalendarHeaderSlots = {
  default(props: RangeCalendarHeaderContext): VNode[];
};
