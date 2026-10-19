import type { ListboxEmits, ListboxProps } from "../types/core/listbox";
import type { Option } from "../types/core/common";
import type { Definition, DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * A listbox instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type ListboxDefinition<T extends Option = Option> = Definition<
  ListboxProps<T>,
  ListboxEmits
>;

/**
 * Declares a listbox. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
 */
export function defineListbox<T extends Option>(
  definition: ListboxDefinition<T>,
): ListboxDefinition<T>;
export function defineListbox<T extends Option>(
  definition: DefinitionSource<ListboxDefinition<T>>,
): ComputedRef<ListboxDefinition<T>>;
export function defineListbox<T extends Option>(
  definition: ListboxDefinition<T> | DefinitionSource<ListboxDefinition<T>>,
): ListboxDefinition<T> | ComputedRef<ListboxDefinition<T>> {
  return define(definition);
}
