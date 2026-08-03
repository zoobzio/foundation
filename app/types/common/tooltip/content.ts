import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  TooltipContentEmits as RekaTooltipContentEmits,
  TooltipContentProps as RekaTooltipContentProps,
} from "reka-ui";

export type TooltipContentForward = Reshape<RekaTooltipContentProps>;

export type TooltipContentProps = RekaTooltipContentProps & {
  modifiers?: ModifierProps<"tooltip-content">;
  tokens?: TokenProps<"tooltip-content">;
  aria?: AriaProps<"tooltip-content">;
};

export type TooltipContentEmits = RekaTooltipContentEmits & ComponentEvents["tooltip-content"];

export type TooltipContentBindings = Bindings<"tooltip-content", TooltipContentForward>;

export type TooltipContentContext = Reshape<TooltipContentProps> & {
  bindings: TooltipContentBindings;
  el: ComponentPublicInstance | null;
};

export type TooltipContentSlots = {
  default(props: TooltipContentContext): VNode[];
};
