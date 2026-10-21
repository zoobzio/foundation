import type { PaginationDefinition } from "../types/core/pagination";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Declares a pagination. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
 */
export function definePagination(
  definition: PaginationDefinition,
): PaginationDefinition;
export function definePagination(
  definition: DefinitionSource<PaginationDefinition>,
): ComputedRef<PaginationDefinition>;
export function definePagination(
  definition: PaginationDefinition | DefinitionSource<PaginationDefinition>,
): PaginationDefinition | ComputedRef<PaginationDefinition> {
  return define(definition);
}
