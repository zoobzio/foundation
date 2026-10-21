import type {
  DirectoryDefinition,
  DirectoryItem,
} from "../types/core/directory";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

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
