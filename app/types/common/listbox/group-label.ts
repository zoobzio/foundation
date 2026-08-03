import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { ListboxGroupLabelProps as RekaListboxGroupLabelProps } from "reka-ui";

export type ListboxGroupLabelForward = Reshape<RekaListboxGroupLabelProps>;

export type ListboxGroupLabelProps = RekaListboxGroupLabelProps & {
  modifiers?: ModifierProps<"listbox-group-label">;
  tokens?: TokenProps<"listbox-group-label">;
  aria?: AriaProps<"listbox-group-label">;
};

export type ListboxGroupLabelEmits = ComponentEvents["listbox-group-label"];

export type ListboxGroupLabelBindings = Bindings<
  "listbox-group-label",
  ListboxGroupLabelForward
>;

export type ListboxGroupLabelContext = Reshape<ListboxGroupLabelProps> & {
  bindings: ListboxGroupLabelBindings;
  el: ComponentPublicInstance | null;
};

export type ListboxGroupLabelSlots = {
  default(props: ListboxGroupLabelContext): VNode[];
};
