import type { TreeDefinition, TreeNode } from "../types/core/tree";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a tree definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineTree<T extends TreeNode>(
  definition: TreeDefinition<T>,
): TreeDefinition<T>;
export function defineTree<T extends TreeNode>(
  definition: DefinitionSource<TreeDefinition<T>>,
): ComputedRef<TreeDefinition<T>>;
export function defineTree<T extends TreeNode>(
  definition: TreeDefinition<T> | DefinitionSource<TreeDefinition<T>>,
): TreeDefinition<T> | ComputedRef<TreeDefinition<T>> {
  return define(definition);
}
