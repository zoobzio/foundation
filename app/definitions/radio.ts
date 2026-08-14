import type { RadioEmits, RadioProps } from "#foundation/types/core/radio";
import type { Definition } from "#foundation/types/definition";

/**
 * A radio instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type RadioDefinition = Definition<
  RadioProps,
  RadioEmits
>;

/**
 * Declares a radio at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineRadio = (
  definition: RadioDefinition,
): RadioDefinition => definition;
