import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  DropdownMenuLabelProps as RekaDropdownMenuLabelProps,
} from "reka-ui";

export type DropdownMenuLabelForward = Reshape<RekaDropdownMenuLabelProps>;

export type DropdownMenuLabelProps = RekaDropdownMenuLabelProps & {
  modifiers?: ModifierProps<"dropdown-menu-label">;
  tokens?: TokenProps<"dropdown-menu-label">;
  aria?: AriaProps<"dropdown-menu-label">;
};

export type DropdownMenuLabelEmits = ComponentEvents["dropdown-menu-label"];

export type DropdownMenuLabelBindings = Bindings<"dropdown-menu-label", DropdownMenuLabelForward>;

export type DropdownMenuLabelContext = Reshape<DropdownMenuLabelProps> & {
  bindings: DropdownMenuLabelBindings;
  el: ComponentPublicInstance | null;
};

export type DropdownMenuLabelSlots = {
  default(props: DropdownMenuLabelContext): VNode[];
};
