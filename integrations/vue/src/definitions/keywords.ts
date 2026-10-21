import type { KeywordsDefinition } from "../types/core/keywords";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Declares a keywords. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
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
