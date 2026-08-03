import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { ListboxItemProps as RekaListboxItemProps } from "reka-ui";

export type ListboxItemForward = Reshape<RekaListboxItemProps>;

export type ListboxItemProps = RekaListboxItemProps & {
  modifiers?: ModifierProps<"listbox-item">;
  tokens?: TokenProps<"listbox-item">;
  aria?: AriaProps<"listbox-item">;
};

export type ListboxItemEmits = ComponentEvents["listbox-item"];

export type ListboxItemBindings = Bindings<"listbox-item", ListboxItemForward>;

export type ListboxItemContext = Reshape<ListboxItemProps> & {
  bindings: ListboxItemBindings;
  el: ComponentPublicInstance | null;
};

export type ListboxItemSlots = {
  default(props: ListboxItemContext): VNode[];
};
