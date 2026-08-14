import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  DropdownMenuItemEmits as RekaDropdownMenuItemEmits,
  DropdownMenuItemProps as RekaDropdownMenuItemProps,
} from "reka-ui";

export type DropdownMenuItemForward = Reshape<RekaDropdownMenuItemProps>;

export type DropdownMenuItemProps = RekaDropdownMenuItemProps & {
  modifiers?: ModifierProps<"dropdown-menu-item">;
  tokens?: TokenProps<"dropdown-menu-item">;
  aria?: AriaProps<"dropdown-menu-item">;
};

export type DropdownMenuItemEmits = RekaDropdownMenuItemEmits & ComponentEvents["dropdown-menu-item"];

export type DropdownMenuItemBindings = Bindings<"dropdown-menu-item", DropdownMenuItemForward>;

export type DropdownMenuItemContext = Reshape<DropdownMenuItemProps> & {
  bindings: DropdownMenuItemBindings;
  el: ComponentPublicInstance | null;
};

export type DropdownMenuItemSlots = {
  default(props: DropdownMenuItemContext): VNode[];
};
