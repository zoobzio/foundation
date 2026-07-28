import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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
