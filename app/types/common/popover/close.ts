import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { PopoverCloseProps as RekaPopoverCloseProps } from "reka-ui";

export type PopoverCloseForward = Reshape<RekaPopoverCloseProps>;

export type PopoverCloseProps = RekaPopoverCloseProps & {
  modifiers?: ModifierProps<"popover-close">;
  tokens?: TokenProps<"popover-close">;
  aria?: AriaProps<"popover-close">;
};

export type PopoverCloseEmits = ComponentEvents["popover-close"];

export type PopoverCloseBindings = Bindings<"popover-close", PopoverCloseForward>;

export type PopoverCloseContext = Reshape<PopoverCloseProps> & {
  bindings: PopoverCloseBindings;
  el: ComponentPublicInstance | null;
};

export type PopoverCloseSlots = {
  default(props: PopoverCloseContext): VNode[];
};
