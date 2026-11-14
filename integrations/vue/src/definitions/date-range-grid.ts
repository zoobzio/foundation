import type { DateRangeGridDefinition } from "../types/components/date-range-grid";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a date range grid definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineDateRangeGrid(
  definition: DateRangeGridDefinition,
): DateRangeGridDefinition;
export function defineDateRangeGrid(
  definition: DefinitionSource<DateRangeGridDefinition>,
): ComputedRef<DateRangeGridDefinition>;
export function defineDateRangeGrid(
  definition:
    | DateRangeGridDefinition
    | DefinitionSource<DateRangeGridDefinition>,
): DateRangeGridDefinition | ComputedRef<DateRangeGridDefinition> {
  return define(definition);
}
