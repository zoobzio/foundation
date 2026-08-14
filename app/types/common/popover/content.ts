import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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

export type PopoverContentEmits = RekaPopoverContentEmits & {};

export type PopoverContentBindings = Bindings<"popover-content", PopoverContentForward>;

export type PopoverContentContext = Reshape<PopoverContentProps> & {
  bindings: PopoverContentBindings;
  el: ComponentPublicInstance | null;
};

export type PopoverContentSlots = {
  default(props: PopoverContentContext): VNode[];
};
