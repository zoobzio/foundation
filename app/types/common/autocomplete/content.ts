import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { ComboboxContentProps as RekaComboboxContentProps } from "reka-ui";

// reka aliases the Autocomplete content to ComboboxContent, so the props are
// the Combobox's own; its dismissal emits (escapeKeyDown, …) fall through as
// attrs.
export type AutocompleteContentForward = Reshape<RekaComboboxContentProps>;

export type AutocompleteContentProps = RekaComboboxContentProps & {
  modifiers?: ModifierProps<"autocomplete-content">;
  tokens?: TokenProps<"autocomplete-content">;
  aria?: AriaProps<"autocomplete-content">;
};

export type AutocompleteContentEmits = {};

export type AutocompleteContentBindings = Bindings<
  "autocomplete-content",
  AutocompleteContentForward
>;

export type AutocompleteContentContext = Reshape<AutocompleteContentProps> & {
  bindings: AutocompleteContentBindings;
  el: ComponentPublicInstance | null;
};

export type AutocompleteContentSlots = {
  default(props: AutocompleteContentContext): VNode[];
};
