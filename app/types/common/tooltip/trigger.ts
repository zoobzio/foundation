import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { EventEmits } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { TooltipTriggerProps as RekaTooltipTriggerProps } from "reka-ui";

export type TooltipTriggerForward = Reshape<RekaTooltipTriggerProps>;

export type TooltipTriggerProps = RekaTooltipTriggerProps & {
  modifiers?: ModifierProps<"tooltip-trigger">;
  tokens?: TokenProps<"tooltip-trigger">;
  aria?: AriaProps<"tooltip-trigger">;
};

export type TooltipTriggerEmits = EventEmits<"click">;

export type TooltipTriggerBindings = Bindings<"tooltip-trigger", TooltipTriggerForward>;

export type TooltipTriggerContext = Reshape<TooltipTriggerProps> & {
  bindings: TooltipTriggerBindings;
  el: ComponentPublicInstance | null;
};

export type TooltipTriggerSlots = {
  default(props: TooltipTriggerContext): VNode[];
};
