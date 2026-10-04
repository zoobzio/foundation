import type { KeywordsEmits, KeywordsProps } from "../types/core/keywords";
import type { Definition, DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * A keywords instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type KeywordsDefinition = Definition<KeywordsProps, KeywordsEmits>;

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
