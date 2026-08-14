import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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

export type DropdownMenuLabelEmits = {};

export type DropdownMenuLabelBindings = Bindings<"dropdown-menu-label", DropdownMenuLabelForward>;

export type DropdownMenuLabelContext = Reshape<DropdownMenuLabelProps> & {
  bindings: DropdownMenuLabelBindings;
  el: ComponentPublicInstance | null;
};

export type DropdownMenuLabelSlots = {
  default(props: DropdownMenuLabelContext): VNode[];
};
