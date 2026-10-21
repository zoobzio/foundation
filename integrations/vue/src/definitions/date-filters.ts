import type { DateFiltersDefinition } from "../types/core/date-filters";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a date filters definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineDateFilters(
  definition: DateFiltersDefinition,
): DateFiltersDefinition;
export function defineDateFilters(
  definition: DefinitionSource<DateFiltersDefinition>,
): ComputedRef<DateFiltersDefinition>;
export function defineDateFilters(
  definition: DateFiltersDefinition | DefinitionSource<DateFiltersDefinition>,
): DateFiltersDefinition | ComputedRef<DateFiltersDefinition> {
  return define(definition);
}
