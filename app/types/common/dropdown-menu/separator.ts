import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  DropdownMenuSeparatorProps as RekaDropdownMenuSeparatorProps,
} from "reka-ui";

export type DropdownMenuSeparatorForward = Reshape<RekaDropdownMenuSeparatorProps>;

export type DropdownMenuSeparatorProps = RekaDropdownMenuSeparatorProps & {
  modifiers?: ModifierProps<"dropdown-menu-separator">;
  tokens?: TokenProps<"dropdown-menu-separator">;
  aria?: AriaProps<"dropdown-menu-separator">;
};

export type DropdownMenuSeparatorEmits = {};

export type DropdownMenuSeparatorBindings = Bindings<"dropdown-menu-separator", DropdownMenuSeparatorForward>;

export type DropdownMenuSeparatorContext = Reshape<DropdownMenuSeparatorProps> & {
  bindings: DropdownMenuSeparatorBindings;
  el: ComponentPublicInstance | null;
};

export type DropdownMenuSeparatorSlots = {
  default(props: DropdownMenuSeparatorContext): VNode[];
};
