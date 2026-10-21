import type { CalendarDefinition } from "../types/core/calendar";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Declares a calendar. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
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
