import type { PaginationEmits, PaginationProps } from "#foundation/types/core/pagination";
import type { Definition } from "#foundation/types/definition";

/**
 * A pagination instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type PaginationDefinition = Definition<
  PaginationProps,
  PaginationEmits
>;

/**
 * Declares a pagination at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const definePagination = (
  definition: PaginationDefinition,
): PaginationDefinition => definition;
