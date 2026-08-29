import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type { AutocompleteRootProps as RekaAutocompleteRootProps } from "reka-ui";

export type AutocompleteRootProps = RekaAutocompleteRootProps;

// reka's AutocompleteRootEmits also carries `highlight`; it falls through as
// an attr (README § behavioral elements). The root declares only the model
// emits useModel needs.
export type AutocompleteRootEmits = {
  "update:modelValue": [value: string];
  "update:open": [value: boolean];
};

export type AutocompleteRootContext = Reshape<
  AutocompleteRootProps,
  "modelValue" | "open"
> & {
  modelValue: Ref<string | undefined>;
  open: Ref<boolean | undefined>;
  el: ComponentPublicInstance | null;
};

export type AutocompleteRootSlots = {
  default(props: AutocompleteRootContext): VNode[];
};
