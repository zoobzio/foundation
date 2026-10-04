import type {
  DirectoryEmits,
  DirectoryItem,
  DirectoryProps,
} from "../types/core/directory";
import type { Definition, DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * A directory instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type DirectoryDefinition<T extends DirectoryItem> = Definition<
  DirectoryProps<T>,
  DirectoryEmits<T>
>;

/**
 * Declares a directory. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
 */
export function defineDirectory<T extends DirectoryItem>(
  definition: DirectoryDefinition<T>,
): DirectoryDefinition<T>;
export function defineDirectory<T extends DirectoryItem>(
  definition: DefinitionSource<DirectoryDefinition<T>>,
): ComputedRef<DirectoryDefinition<T>>;
export function defineDirectory<T extends DirectoryItem>(
  definition: DirectoryDefinition<T> | DefinitionSource<DirectoryDefinition<T>>,
): DirectoryDefinition<T> | ComputedRef<DirectoryDefinition<T>> {
  return define(definition);
}
