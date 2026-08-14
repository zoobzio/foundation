import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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
