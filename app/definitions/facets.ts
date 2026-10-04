import type { FacetItem, FacetsEmits, FacetsProps } from "../types/core/facets";
import type { Definition, DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * A facets instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type FacetsDefinition<T extends FacetItem = FacetItem> = Definition<
  FacetsProps<T>,
  FacetsEmits
>;

/**
 * Declares a facets. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
 */
export function defineFacets<T extends FacetItem>(
  definition: FacetsDefinition<T>,
): FacetsDefinition<T>;
export function defineFacets<T extends FacetItem>(
  definition: DefinitionSource<FacetsDefinition<T>>,
): ComputedRef<FacetsDefinition<T>>;
export function defineFacets<T extends FacetItem>(
  definition: FacetsDefinition<T> | DefinitionSource<FacetsDefinition<T>>,
): FacetsDefinition<T> | ComputedRef<FacetsDefinition<T>> {
  return define(definition);
}
