import type { DatePickerEmits, DatePickerProps } from "#foundation/types/core/date-picker";
import type { Definition } from "#foundation/types/definition";

/**
 * A date-picker instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type DatePickerDefinition = Definition<
  DatePickerProps,
  DatePickerEmits
>;

/**
 * Declares a date-picker at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineDatePicker = (
  definition: DatePickerDefinition,
): DatePickerDefinition => definition;
