import type {
  AutocompleteEmits,
  AutocompleteProps,
} from "../types/core/autocomplete";
import type { Definition, DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * An autocomplete instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type AutocompleteDefinition<M = unknown> = Definition<
  AutocompleteProps<M>,
  AutocompleteEmits<M>
>;

/**
 * Declares an autocomplete. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
 */
export function defineAutocomplete<M = unknown>(
  definition: AutocompleteDefinition<M>,
): AutocompleteDefinition<M>;
export function defineAutocomplete<M = unknown>(
  definition: DefinitionSource<AutocompleteDefinition<M>>,
): ComputedRef<AutocompleteDefinition<M>>;
export function defineAutocomplete<M = unknown>(
  definition:
    | AutocompleteDefinition<M>
    | DefinitionSource<AutocompleteDefinition<M>>,
): AutocompleteDefinition<M> | ComputedRef<AutocompleteDefinition<M>> {
  return define(definition);
}
