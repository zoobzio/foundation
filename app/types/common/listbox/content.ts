import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { ListboxContentProps as RekaListboxContentProps } from "reka-ui";

export type ListboxContentForward = Reshape<RekaListboxContentProps>;

export type ListboxContentProps = RekaListboxContentProps & {
  modifiers?: ModifierProps<"listbox-content">;
  tokens?: TokenProps<"listbox-content">;
  aria?: AriaProps<"listbox-content">;
};

export type ListboxContentEmits = ComponentEvents["listbox-content"];

export type ListboxContentBindings = Bindings<"listbox-content", ListboxContentForward>;

export type ListboxContentContext = Reshape<ListboxContentProps> & {
  bindings: ListboxContentBindings;
  el: ComponentPublicInstance | null;
};

export type ListboxContentSlots = {
  default(props: ListboxContentContext): VNode[];
};
