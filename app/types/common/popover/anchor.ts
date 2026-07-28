import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { PopoverAnchorProps as RekaPopoverAnchorProps } from "reka-ui";

export type { ReferenceElement } from "reka-ui";

export type PopoverAnchorForward = Reshape<RekaPopoverAnchorProps>;

export type PopoverAnchorProps = RekaPopoverAnchorProps & {
  modifiers?: ModifierProps<"popover-anchor">;
  tokens?: TokenProps<"popover-anchor">;
  aria?: AriaProps<"popover-anchor">;
};

export type PopoverAnchorEmits = ComponentEvents["popover-anchor"];

export type PopoverAnchorBindings = Bindings<"popover-anchor", PopoverAnchorForward>;

export type PopoverAnchorContext = Reshape<PopoverAnchorProps> & {
  bindings: PopoverAnchorBindings;
  el: ComponentPublicInstance | null;
};

export type PopoverAnchorSlots = {
  default(props: PopoverAnchorContext): VNode[];
};
