import type { tree } from "../../elements.config";

export type TreeProps = {
  items: TreeNode[];
  modelValue?: TreeNode | TreeNode[];
  expanded?: string[];
  multiple?: boolean;
  selectionBehavior?: "replace" | "toggle";
  tokens?: Tokens<
    | typeof tree.root
    | typeof tree.branch
    | typeof tree.branchContent
    | typeof tree.branchLabel
    | typeof tree.leaf
    | typeof tree.leafContent
  >;
};

export type TreeEmits = {
  "update:modelValue": [TreeNode | TreeNode[]];
  "update:expanded": [string[]];
};

export const defineTree = useComponentRecipe<TreeProps, TreeEmits>();
