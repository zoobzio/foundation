import type {
  DatePickerEmits,
  DatePickerProps,
} from "../types/core/date-picker";
import type { Definition, DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * A date-picker instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type DatePickerDefinition = Definition<DatePickerProps, DatePickerEmits>;

/**
 * Declares a date-picker. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
 */
export function defineDatePicker(
  definition: DatePickerDefinition,
): DatePickerDefinition;
export function defineDatePicker(
  definition: DefinitionSource<DatePickerDefinition>,
): ComputedRef<DatePickerDefinition>;
export function defineDatePicker(
  definition: DatePickerDefinition | DefinitionSource<DatePickerDefinition>,
): DatePickerDefinition | ComputedRef<DatePickerDefinition> {
  return define(definition);
}
