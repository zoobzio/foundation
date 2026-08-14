import type { DateRangePickerEmits, DateRangePickerProps } from "#foundation/types/core/date-range-picker";
import type { Definition } from "#foundation/types/definition";

/**
 * A date-range-picker instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type DateRangePickerDefinition = Definition<
  DateRangePickerProps,
  DateRangePickerEmits
>;

/**
 * Declares a date-range-picker at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineDateRangePicker = (
  definition: DateRangePickerDefinition,
): DateRangePickerDefinition => definition;
