import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { ToggleGroupItemProps as RekaToggleGroupItemProps } from "reka-ui";

export type ToggleGroupItemForward = Reshape<RekaToggleGroupItemProps>;

export type ToggleGroupItemProps = RekaToggleGroupItemProps & {
  modifiers?: ModifierProps<"toggle-group-item">;
  tokens?: TokenProps<"toggle-group-item">;
  aria?: AriaProps<"toggle-group-item">;
};

export type ToggleGroupItemEmits = ComponentEvents["toggle-group-item"];

export type ToggleGroupItemBindings = Bindings<"toggle-group-item", ToggleGroupItemForward>;

export type ToggleGroupItemContext = Reshape<ToggleGroupItemProps> & {
  bindings: ToggleGroupItemBindings;
  el: ComponentPublicInstance | null;
};

export type ToggleGroupItemSlots = {
  default(props: ToggleGroupItemContext): VNode[];
};
