import type { CalendarDefinition } from "../types/components/calendar";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a calendar definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineCalendar<I, O>(
  definition: CalendarDefinition<I, O>,
): CalendarDefinition<I, O>;
export function defineCalendar<I, O>(
  definition: DefinitionSource<CalendarDefinition<I, O>>,
): ComputedRef<CalendarDefinition<I, O>>;
export function defineCalendar<I, O>(
  definition:
    | CalendarDefinition<I, O>
    | DefinitionSource<CalendarDefinition<I, O>>,
): CalendarDefinition<I, O> | ComputedRef<CalendarDefinition<I, O>> {
  return define(definition);
}
