import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, Ref } from "vue";
import type {
  AutocompleteInputEmits as RekaAutocompleteInputEmits,
  AutocompleteInputProps as RekaAutocompleteInputProps,
} from "reka-ui";

// AutocompleteInput renders a native <input>; `placeholder` is a legitimate
// native attr on that element but absent from reka's prop type, so it is
// surfaced here.
type InputNative = { placeholder?: string };

export type AutocompleteInputForward = Reshape<
  RekaAutocompleteInputProps,
  "modelValue"
> &
  InputNative;

export type AutocompleteInputProps = RekaAutocompleteInputProps &
  InputNative & {
    modifiers?: ModifierProps<"autocomplete-input">;
    tokens?: TokenProps<"autocomplete-input">;
    aria?: AriaProps<"autocomplete-input">;
  };

export type AutocompleteInputEmits = RekaAutocompleteInputEmits & {};

export type AutocompleteInputBindings = Bindings<
  "autocomplete-input",
  AutocompleteInputForward
>;

export type AutocompleteInputContext = Reshape<
  AutocompleteInputProps,
  "modelValue"
> & {
  modelValue: Ref<string | undefined>;
  bindings: AutocompleteInputBindings;
  el: ComponentPublicInstance | null;
};
