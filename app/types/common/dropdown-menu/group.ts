import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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

export type DropdownMenuGroupEmits = ComponentEvents["dropdown-menu-group"];

export type DropdownMenuGroupBindings = Bindings<"dropdown-menu-group", DropdownMenuGroupForward>;

export type DropdownMenuGroupContext = Reshape<DropdownMenuGroupProps> & {
  bindings: DropdownMenuGroupBindings;
  el: ComponentPublicInstance | null;
};

export type DropdownMenuGroupSlots = {
  default(props: DropdownMenuGroupContext): VNode[];
};
