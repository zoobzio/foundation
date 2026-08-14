import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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
