import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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
