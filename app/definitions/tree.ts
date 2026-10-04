import type { TreeEmits, TreeNode, TreeProps } from "../types/core/tree";
import type { Definition, DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * A tree instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type TreeDefinition<T extends TreeNode> = Definition<
  TreeProps<T>,
  TreeEmits<T>
>;

/**
 * Declares a tree. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
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
