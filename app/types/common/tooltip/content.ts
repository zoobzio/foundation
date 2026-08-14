import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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
