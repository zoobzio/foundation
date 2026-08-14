import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { RangeCalendarHeaderProps as RekaRangeCalendarHeaderProps } from "reka-ui";

export type RangeCalendarHeaderForward = Reshape<RekaRangeCalendarHeaderProps>;

export type RangeCalendarHeaderProps = RekaRangeCalendarHeaderProps & {
  modifiers?: ModifierProps<"range-calendar-header">;
  tokens?: TokenProps<"range-calendar-header">;
  aria?: AriaProps<"range-calendar-header">;
};

export type RangeCalendarHeaderEmits = {};

export type RangeCalendarHeaderBindings = Bindings<"range-calendar-header", RangeCalendarHeaderForward>;

export type RangeCalendarHeaderContext = Reshape<RangeCalendarHeaderProps> & {
  bindings: RangeCalendarHeaderBindings;
  el: ComponentPublicInstance | null;
};

export type RangeCalendarHeaderSlots = {
  default(props: RangeCalendarHeaderContext): VNode[];
};
