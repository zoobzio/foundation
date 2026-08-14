import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { EventEmits } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { ToggleGroupItemProps as RekaToggleGroupItemProps } from "reka-ui";

export type ToggleGroupItemForward = Reshape<RekaToggleGroupItemProps>;

export type ToggleGroupItemProps = RekaToggleGroupItemProps & {
  modifiers?: ModifierProps<"toggle-group-item">;
  tokens?: TokenProps<"toggle-group-item">;
  aria?: AriaProps<"toggle-group-item">;
};

export type ToggleGroupItemEmits = EventEmits<"click">;

export type ToggleGroupItemBindings = Bindings<"toggle-group-item", ToggleGroupItemForward>;

export type ToggleGroupItemContext = Reshape<ToggleGroupItemProps> & {
  bindings: ToggleGroupItemBindings;
  el: ComponentPublicInstance | null;
};

export type ToggleGroupItemSlots = {
  default(props: ToggleGroupItemContext): VNode[];
};
