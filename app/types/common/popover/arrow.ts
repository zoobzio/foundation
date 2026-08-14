import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { PopoverArrowProps as RekaPopoverArrowProps } from "reka-ui";

export type PopoverArrowForward = Reshape<RekaPopoverArrowProps>;

export type PopoverArrowProps = RekaPopoverArrowProps & {
  modifiers?: ModifierProps<"popover-arrow">;
  tokens?: TokenProps<"popover-arrow">;
  aria?: AriaProps<"popover-arrow">;
};

export type PopoverArrowEmits = ComponentEvents["popover-arrow"];

export type PopoverArrowBindings = Bindings<"popover-arrow", PopoverArrowForward>;

export type PopoverArrowContext = Reshape<PopoverArrowProps> & {
  bindings: PopoverArrowBindings;
  el: ComponentPublicInstance | null;
};

export type PopoverArrowSlots = {
  default(props: PopoverArrowContext): VNode[];
};
