import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { PopoverTriggerProps as RekaPopoverTriggerProps } from "reka-ui";

export type PopoverTriggerForward = Reshape<RekaPopoverTriggerProps>;

export type PopoverTriggerProps = RekaPopoverTriggerProps & {
  modifiers?: ModifierProps<"popover-trigger">;
  tokens?: TokenProps<"popover-trigger">;
  aria?: AriaProps<"popover-trigger">;
};

export type PopoverTriggerEmits = ComponentEvents["popover-trigger"];

export type PopoverTriggerBindings = Bindings<"popover-trigger", PopoverTriggerForward>;

export type PopoverTriggerContext = Reshape<PopoverTriggerProps> & {
  bindings: PopoverTriggerBindings;
  el: ComponentPublicInstance | null;
};

export type PopoverTriggerSlots = {
  default(props: PopoverTriggerContext): VNode[];
};
