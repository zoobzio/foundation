import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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
