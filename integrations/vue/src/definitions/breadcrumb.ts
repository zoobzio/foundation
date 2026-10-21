import type {
  BreadcrumbDefinition,
  BreadcrumbItem,
} from "../types/core/breadcrumb";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a breadcrumb definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
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
