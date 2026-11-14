import type { DateGridDefinition } from "../types/components/date-grid";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a date grid definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineDateGrid(
  definition: DateGridDefinition,
): DateGridDefinition;
export function defineDateGrid(
  definition: DefinitionSource<DateGridDefinition>,
): ComputedRef<DateGridDefinition>;
export function defineDateGrid(
  definition: DateGridDefinition | DefinitionSource<DateGridDefinition>,
): DateGridDefinition | ComputedRef<DateGridDefinition> {
  return define(definition);
}
