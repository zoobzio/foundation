import type { AutocompleteDefinition } from "../types/components/autocomplete";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates an autocomplete definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineAutocomplete(
  definition: AutocompleteDefinition,
): AutocompleteDefinition;
export function defineAutocomplete(
  definition: DefinitionSource<AutocompleteDefinition>,
): ComputedRef<AutocompleteDefinition>;
export function defineAutocomplete(
  definition: AutocompleteDefinition | DefinitionSource<AutocompleteDefinition>,
): AutocompleteDefinition | ComputedRef<AutocompleteDefinition> {
  return define(definition);
}
