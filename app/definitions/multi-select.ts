import type { MultiSelectEmits, MultiSelectProps } from "#foundation/types/core/multi-select";
import type { Option } from "#foundation/types/core/common";
import type { Definition } from "#foundation/types/definition";

/**
 * A multi-select instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type MultiSelectDefinition<T extends Option> = Definition<
  MultiSelectProps<T>,
  MultiSelectEmits<T>
>;

/**
 * Declares a multi-select at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineMultiSelect = <T extends Option>(
  definition: MultiSelectDefinition<T>,
): MultiSelectDefinition<T> => definition;
