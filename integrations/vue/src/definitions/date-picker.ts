import type { DatePickerDefinition } from "../types/core/date-picker";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a date picker definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
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
