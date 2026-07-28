import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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
