import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { ListboxGroupProps as RekaListboxGroupProps } from "reka-ui";

export type ListboxGroupForward = Reshape<RekaListboxGroupProps>;

export type ListboxGroupProps = RekaListboxGroupProps & {
  modifiers?: ModifierProps<"listbox-group">;
  tokens?: TokenProps<"listbox-group">;
  aria?: AriaProps<"listbox-group">;
};

export type ListboxGroupEmits = ComponentEvents["listbox-group"];

export type ListboxGroupBindings = Bindings<"listbox-group", ListboxGroupForward>;

export type ListboxGroupContext = Reshape<ListboxGroupProps> & {
  bindings: ListboxGroupBindings;
  el: ComponentPublicInstance | null;
};

export type ListboxGroupSlots = {
  default(props: ListboxGroupContext): VNode[];
};
