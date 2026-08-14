import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { PopoverAnchorProps as RekaPopoverAnchorProps } from "reka-ui";

export type { ReferenceElement } from "reka-ui";

export type PopoverAnchorForward = Reshape<RekaPopoverAnchorProps>;

export type PopoverAnchorProps = RekaPopoverAnchorProps & {
  modifiers?: ModifierProps<"popover-anchor">;
  tokens?: TokenProps<"popover-anchor">;
  aria?: AriaProps<"popover-anchor">;
};

export type PopoverAnchorEmits = {};

export type PopoverAnchorBindings = Bindings<"popover-anchor", PopoverAnchorForward>;

export type PopoverAnchorContext = Reshape<PopoverAnchorProps> & {
  bindings: PopoverAnchorBindings;
  el: ComponentPublicInstance | null;
};

export type PopoverAnchorSlots = {
  default(props: PopoverAnchorContext): VNode[];
};
