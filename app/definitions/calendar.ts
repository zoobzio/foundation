import type { CalendarEmits, CalendarProps } from "#foundation/types/core/calendar";
import type { Definition } from "#foundation/types/definition";

/**
 * A calendar instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type CalendarDefinition = Definition<
  CalendarProps,
  CalendarEmits
>;

/**
 * Declares a calendar at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineCalendar = (
  definition: CalendarDefinition,
): CalendarDefinition => definition;
