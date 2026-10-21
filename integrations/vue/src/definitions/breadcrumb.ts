import type {
  BreadcrumbDefinition,
  BreadcrumbItem,
} from "../types/core/breadcrumb";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Declares a breadcrumb. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
 */
export function defineBreadcrumb<T extends BreadcrumbItem>(
  definition: BreadcrumbDefinition<T>,
): BreadcrumbDefinition<T>;
export function defineBreadcrumb<T extends BreadcrumbItem>(
  definition: DefinitionSource<BreadcrumbDefinition<T>>,
): ComputedRef<BreadcrumbDefinition<T>>;
export function defineBreadcrumb<T extends BreadcrumbItem>(
  definition:
    | BreadcrumbDefinition<T>
    | DefinitionSource<BreadcrumbDefinition<T>>,
): BreadcrumbDefinition<T> | ComputedRef<BreadcrumbDefinition<T>> {
  return define(definition);
}
