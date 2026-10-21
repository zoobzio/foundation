import type { AutocompleteDefinition } from "../types/core/autocomplete";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates an autocomplete definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
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
