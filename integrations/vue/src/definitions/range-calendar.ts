import type { RangeCalendarDefinition } from "../types/core/range-calendar";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a range calendar definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineRangeCalendar(
  definition: RangeCalendarDefinition,
): RangeCalendarDefinition;
export function defineRangeCalendar(
  definition: DefinitionSource<RangeCalendarDefinition>,
): ComputedRef<RangeCalendarDefinition>;
export function defineRangeCalendar(
  definition:
    | RangeCalendarDefinition
    | DefinitionSource<RangeCalendarDefinition>,
): RangeCalendarDefinition | ComputedRef<RangeCalendarDefinition> {
  return define(definition);
}
