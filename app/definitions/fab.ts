import type { FabEmits, FabProps } from "#foundation/types/core/fab";
import type { Definition } from "#foundation/types/definition";

/**
 * A fab instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type FabDefinition = Definition<
  FabProps,
  FabEmits
>;

/**
 * Declares a fab at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineFab = (
  definition: FabDefinition,
): FabDefinition => definition;
