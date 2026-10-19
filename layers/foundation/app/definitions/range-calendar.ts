import type {
  RangeCalendarEmits,
  RangeCalendarProps,
} from "../types/core/range-calendar";
import type { Definition, DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * A range-calendar instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type RangeCalendarDefinition = Definition<
  RangeCalendarProps,
  RangeCalendarEmits
>;

/**
 * Declares a range-calendar. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
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
