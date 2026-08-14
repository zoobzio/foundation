import type { SelectEmits, SelectProps } from "#foundation/types/core/select";
import type { Option } from "#foundation/types/core/common";
import type { Definition } from "#foundation/types/definition";

/**
 * A select instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type SelectDefinition<T extends Option> = Definition<
  SelectProps<T>,
  SelectEmits<T>
>;

/**
 * Declares a select at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineSelect = <T extends Option>(
  definition: SelectDefinition<T>,
): SelectDefinition<T> => definition;
