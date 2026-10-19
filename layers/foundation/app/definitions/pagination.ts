import type {
  PaginationEmits,
  PaginationProps,
} from "../types/core/pagination";
import type { Definition, DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * A pagination instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type PaginationDefinition = Definition<PaginationProps, PaginationEmits>;

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
