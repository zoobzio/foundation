import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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
