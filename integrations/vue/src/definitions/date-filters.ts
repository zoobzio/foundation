import type { DateFiltersDefinition } from "../types/core/date-filters";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Declares a date-filters. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
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
