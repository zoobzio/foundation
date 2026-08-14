import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  DropdownMenuContentEmits as RekaDropdownMenuContentEmits,
  DropdownMenuContentProps as RekaDropdownMenuContentProps,
} from "reka-ui";

export type DropdownMenuContentForward = Reshape<RekaDropdownMenuContentProps>;

export type DropdownMenuContentProps = RekaDropdownMenuContentProps & {
  modifiers?: ModifierProps<"dropdown-menu-content">;
  tokens?: TokenProps<"dropdown-menu-content">;
  aria?: AriaProps<"dropdown-menu-content">;
};

export type DropdownMenuContentEmits = RekaDropdownMenuContentEmits & {};

export type DropdownMenuContentBindings = Bindings<"dropdown-menu-content", DropdownMenuContentForward>;

export type DropdownMenuContentContext = Reshape<DropdownMenuContentProps> & {
  bindings: DropdownMenuContentBindings;
  el: ComponentPublicInstance | null;
};

export type DropdownMenuContentSlots = {
  default(props: DropdownMenuContentContext): VNode[];
};
