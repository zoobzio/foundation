import type { ListboxEmits, ListboxProps } from "../types/core/listbox";
import type { Definition } from "../types/definition";

/**
 * A listbox instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type ListboxDefinition = Definition<
  ListboxProps,
  ListboxEmits
>;

/**
 * Declares a listbox at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineListbox = (
  definition: ListboxDefinition,
): ListboxDefinition => definition;
