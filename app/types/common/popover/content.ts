import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  PopoverContentEmits as RekaPopoverContentEmits,
  PopoverContentProps as RekaPopoverContentProps,
} from "reka-ui";

export type PopoverContentForward = Reshape<RekaPopoverContentProps>;

export type PopoverContentProps = RekaPopoverContentProps & {
  modifiers?: ModifierProps<"popover-content">;
  tokens?: TokenProps<"popover-content">;
  aria?: AriaProps<"popover-content">;
};

export type PopoverContentEmits = RekaPopoverContentEmits & ComponentEvents["popover-content"];

export type PopoverContentBindings = Bindings<"popover-content", PopoverContentForward>;

export type PopoverContentContext = Reshape<PopoverContentProps> & {
  bindings: PopoverContentBindings;
  el: ComponentPublicInstance | null;
};

export type PopoverContentSlots = {
  default(props: PopoverContentContext): VNode[];
};
