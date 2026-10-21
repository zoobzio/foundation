import type { DateRangePickerDefinition } from "../types/components/date-range-picker";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a date range picker definition. A plain object returns as is.
 * A ref or getter returns a computed definition that tracks its source.
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
