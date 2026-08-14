import type { DateFiltersEmits, DateFiltersProps } from "../types/core/date-filters";
import type { Definition } from "../types/definition";

/**
 * A date-filters instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type DateFiltersDefinition = Definition<
  DateFiltersProps,
  DateFiltersEmits
>;

/**
 * Declares a date-filters at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineDateFilters = (
  definition: DateFiltersDefinition,
): DateFiltersDefinition => definition;
