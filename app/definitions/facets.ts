import type { FacetItem, FacetsEmits, FacetsProps } from "../types/core/facets";
import type { Definition } from "../types/definition";

/**
 * A facets instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type FacetsDefinition<T extends FacetItem = FacetItem> = Definition<
  FacetsProps<T>,
  FacetsEmits
>;

/**
 * Declares a facets at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineFacets = <T extends FacetItem>(
  definition: FacetsDefinition<T>,
): FacetsDefinition<T> => definition;
