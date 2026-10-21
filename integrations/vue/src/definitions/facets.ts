import type { FacetsDefinition, FacetItem } from "../types/core/facets";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a facets definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
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
