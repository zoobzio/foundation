import type { TreeEmits, TreeNode, TreeProps } from "../types/core/tree";
import type { Definition } from "../types/definition";

/**
 * A tree instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type TreeDefinition<T extends TreeNode> = Definition<
  TreeProps<T>,
  TreeEmits<T>
>;

/**
 * Declares a tree at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineTree = <T extends TreeNode>(
  definition: TreeDefinition<T>,
): TreeDefinition<T> => definition;
