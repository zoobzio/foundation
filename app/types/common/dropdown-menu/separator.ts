import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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

export type DropdownMenuSeparatorEmits = ComponentEvents["dropdown-menu-separator"];

export type DropdownMenuSeparatorBindings = Bindings<"dropdown-menu-separator", DropdownMenuSeparatorForward>;

export type DropdownMenuSeparatorContext = Reshape<DropdownMenuSeparatorProps> & {
  bindings: DropdownMenuSeparatorBindings;
  el: ComponentPublicInstance | null;
};

export type DropdownMenuSeparatorSlots = {
  default(props: DropdownMenuSeparatorContext): VNode[];
};
