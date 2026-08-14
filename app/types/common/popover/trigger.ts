import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { EventEmits } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { PopoverTriggerProps as RekaPopoverTriggerProps } from "reka-ui";

export type PopoverTriggerForward = Reshape<RekaPopoverTriggerProps>;

export type PopoverTriggerProps = RekaPopoverTriggerProps & {
  modifiers?: ModifierProps<"popover-trigger">;
  tokens?: TokenProps<"popover-trigger">;
  aria?: AriaProps<"popover-trigger">;
};

export type PopoverTriggerEmits = EventEmits<"click">;

export type PopoverTriggerBindings = Bindings<"popover-trigger", PopoverTriggerForward>;

export type PopoverTriggerContext = Reshape<PopoverTriggerProps> & {
  bindings: PopoverTriggerBindings;
  el: ComponentPublicInstance | null;
};

export type PopoverTriggerSlots = {
  default(props: PopoverTriggerContext): VNode[];
};
