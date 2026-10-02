import type { RadioEmits, RadioProps } from "../types/core/radio";
import type { Option } from "../types/core/common";
import type { Definition } from "../types/definition";

/**
 * A radio instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type RadioDefinition<T extends Option = Option> = Definition<
  RadioProps<T>,
  RadioEmits
>;

/**
 * Declares a radio at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineRadio = <T extends Option>(
  definition: RadioDefinition<T>,
): RadioDefinition<T> => definition;
