import type { PaginationDefinition } from "../types/components/pagination";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a pagination definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
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
