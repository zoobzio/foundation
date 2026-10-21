import type { ListboxDefinition } from "../types/core/listbox";
import type { Option } from "../types/common";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a listbox definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
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
