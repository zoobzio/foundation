import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  DropdownMenuTriggerProps as RekaDropdownMenuTriggerProps,
} from "reka-ui";

export type DropdownMenuTriggerForward = Reshape<RekaDropdownMenuTriggerProps>;

export type DropdownMenuTriggerProps = RekaDropdownMenuTriggerProps & {
  modifiers?: ModifierProps<"dropdown-menu-trigger">;
  tokens?: TokenProps<"dropdown-menu-trigger">;
  aria?: AriaProps<"dropdown-menu-trigger">;
};

export type DropdownMenuTriggerEmits = ComponentEvents["dropdown-menu-trigger"];

export type DropdownMenuTriggerBindings = Bindings<"dropdown-menu-trigger", DropdownMenuTriggerForward>;

export type DropdownMenuTriggerContext = Reshape<DropdownMenuTriggerProps> & {
  bindings: DropdownMenuTriggerBindings;
  el: ComponentPublicInstance | null;
};

export type DropdownMenuTriggerSlots = {
  default(props: DropdownMenuTriggerContext): VNode[];
};
