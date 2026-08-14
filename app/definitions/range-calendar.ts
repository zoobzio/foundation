import type { RangeCalendarEmits, RangeCalendarProps } from "#foundation/types/core/range-calendar";
import type { Definition } from "#foundation/types/definition";

/**
 * A range-calendar instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type RangeCalendarDefinition = Definition<
  RangeCalendarProps,
  RangeCalendarEmits
>;

/**
 * Declares a range-calendar at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineRangeCalendar = (
  definition: RangeCalendarDefinition,
): RangeCalendarDefinition => definition;
