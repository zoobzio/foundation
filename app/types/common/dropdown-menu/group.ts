import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  DropdownMenuGroupProps as RekaDropdownMenuGroupProps,
} from "reka-ui";

export type DropdownMenuGroupForward = Reshape<RekaDropdownMenuGroupProps>;

export type DropdownMenuGroupProps = RekaDropdownMenuGroupProps & {
  modifiers?: ModifierProps<"dropdown-menu-group">;
  tokens?: TokenProps<"dropdown-menu-group">;
  aria?: AriaProps<"dropdown-menu-group">;
};

export type DropdownMenuGroupEmits = {};

export type DropdownMenuGroupBindings = Bindings<"dropdown-menu-group", DropdownMenuGroupForward>;

export type DropdownMenuGroupContext = Reshape<DropdownMenuGroupProps> & {
  bindings: DropdownMenuGroupBindings;
  el: ComponentPublicInstance | null;
};

export type DropdownMenuGroupSlots = {
  default(props: DropdownMenuGroupContext): VNode[];
};
