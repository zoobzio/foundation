import type { KeywordsDefinition } from "../types/core/keywords";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a keywords definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineKeywords(
  definition: KeywordsDefinition,
): KeywordsDefinition;
export function defineKeywords(
  definition: DefinitionSource<KeywordsDefinition>,
): ComputedRef<KeywordsDefinition>;
export function defineKeywords(
  definition: KeywordsDefinition | DefinitionSource<KeywordsDefinition>,
): KeywordsDefinition | ComputedRef<KeywordsDefinition> {
  return define(definition);
}
