import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { SelectItemProps as RekaSelectItemProps } from "reka-ui";

export type SelectItemForward = Reshape<RekaSelectItemProps>;

export type SelectItemProps = RekaSelectItemProps & {
  modifiers?: ModifierProps<"select-item">;
  tokens?: TokenProps<"select-item">;
  aria?: AriaProps<"select-item">;
};

export type SelectItemEmits = ComponentEvents["select-item"];

export type SelectItemBindings = Bindings<"select-item", SelectItemForward>;

export type SelectItemContext = Reshape<SelectItemProps> & {
  bindings: SelectItemBindings;
  el: ComponentPublicInstance | null;
};

export type SelectItemSlots = {
  default(props: SelectItemContext): VNode[];
};
