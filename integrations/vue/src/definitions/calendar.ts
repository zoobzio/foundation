import type { CalendarDefinition } from "../types/core/calendar";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a calendar definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineCalendar(
  definition: CalendarDefinition,
): CalendarDefinition;
export function defineCalendar(
  definition: DefinitionSource<CalendarDefinition>,
): ComputedRef<CalendarDefinition>;
export function defineCalendar(
  definition: CalendarDefinition | DefinitionSource<CalendarDefinition>,
): CalendarDefinition | ComputedRef<CalendarDefinition> {
  return define(definition);
}
