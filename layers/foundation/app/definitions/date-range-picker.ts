import type {
  DateRangePickerEmits,
  DateRangePickerProps,
} from "../types/core/date-range-picker";
import type { Definition, DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * A date-range-picker instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type DateRangePickerDefinition = Definition<
  DateRangePickerProps,
  DateRangePickerEmits
>;

/**
 * Declares a date-range-picker. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
 */
export function defineDateRangePicker(
  definition: DateRangePickerDefinition,
): DateRangePickerDefinition;
export function defineDateRangePicker(
  definition: DefinitionSource<DateRangePickerDefinition>,
): ComputedRef<DateRangePickerDefinition>;
export function defineDateRangePicker(
  definition:
    | DateRangePickerDefinition
    | DefinitionSource<DateRangePickerDefinition>,
): DateRangePickerDefinition | ComputedRef<DateRangePickerDefinition> {
  return define(definition);
}
