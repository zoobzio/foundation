import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { TooltipTriggerProps as RekaTooltipTriggerProps } from "reka-ui";

export type TooltipTriggerForward = Reshape<RekaTooltipTriggerProps>;

export type TooltipTriggerProps = RekaTooltipTriggerProps & {
  modifiers?: ModifierProps<"tooltip-trigger">;
  tokens?: TokenProps<"tooltip-trigger">;
  aria?: AriaProps<"tooltip-trigger">;
};

export type TooltipTriggerEmits = ComponentEvents["tooltip-trigger"];

export type TooltipTriggerBindings = Bindings<"tooltip-trigger", TooltipTriggerForward>;

export type TooltipTriggerContext = Reshape<TooltipTriggerProps> & {
  bindings: TooltipTriggerBindings;
  el: ComponentPublicInstance | null;
};

export type TooltipTriggerSlots = {
  default(props: TooltipTriggerContext): VNode[];
};
