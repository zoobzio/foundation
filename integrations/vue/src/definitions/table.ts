import type { TableDefinition } from "../types/components/table";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a table definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineTable<T>(
  definition: TableDefinition<T>,
): TableDefinition<T>;
export function defineTable<T>(
  definition: DefinitionSource<TableDefinition<T>>,
): ComputedRef<TableDefinition<T>>;
export function defineTable<T>(
  definition: TableDefinition<T> | DefinitionSource<TableDefinition<T>>,
): TableDefinition<T> | ComputedRef<TableDefinition<T>> {
  return define(definition);
}
