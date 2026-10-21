import type {
  DirectoryDefinition,
  DirectoryItem,
} from "../types/components/directory";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a directory definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
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
