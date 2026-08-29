import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  ComboboxItemEmits as RekaComboboxItemEmits,
  ComboboxItemProps as RekaComboboxItemProps,
} from "reka-ui";

// reka aliases the Autocomplete item to ComboboxItem, so the props are the
// Combobox's own.
export type AutocompleteItemForward = Reshape<RekaComboboxItemProps>;

export type AutocompleteItemProps = RekaComboboxItemProps & {
  modifiers?: ModifierProps<"autocomplete-item">;
  tokens?: TokenProps<"autocomplete-item">;
  aria?: AriaProps<"autocomplete-item">;
};

// `select` is declared by the reka primitive itself and falls through as an
// attr (README § behavioral elements); the alias exists so core manifests can
// type the listener. Calling `event.preventDefault()` in the listener blocks
// reka's default selection (model write + close).
export type AutocompleteItemEmits = RekaComboboxItemEmits & {};

export type AutocompleteItemBindings = Bindings<
  "autocomplete-item",
  AutocompleteItemForward
>;

export type AutocompleteItemContext = Reshape<AutocompleteItemProps> & {
  bindings: AutocompleteItemBindings;
  el: ComponentPublicInstance | null;
};

export type AutocompleteItemSlots = {
  default(props: AutocompleteItemContext): VNode[];
};
