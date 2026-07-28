import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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

export type DropdownMenuContentEmits = RekaDropdownMenuContentEmits & ComponentEvents["dropdown-menu-content"];

export type DropdownMenuContentBindings = Bindings<"dropdown-menu-content", DropdownMenuContentForward>;

export type DropdownMenuContentContext = Reshape<DropdownMenuContentProps> & {
  bindings: DropdownMenuContentBindings;
  el: ComponentPublicInstance | null;
};

export type DropdownMenuContentSlots = {
  default(props: DropdownMenuContentContext): VNode[];
};
