import type { ListboxEmits, ListboxProps } from "../types/core/listbox";
import type { Option } from "../types/core/common";
import type { Definition } from "../types/definition";

/**
 * A listbox instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type ListboxDefinition<T extends Option = Option> = Definition<
  ListboxProps<T>,
  ListboxEmits
>;

/**
 * Declares a listbox at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineListbox = <T extends Option>(
  definition: ListboxDefinition<T>,
): ListboxDefinition<T> => definition;
