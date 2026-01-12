export type TreeProps = {
  items: TreeNode[];
  modelValue?: TreeNode | TreeNode[];
  expanded?: string[];
  multiple?: boolean;
  selectionBehavior?: "replace" | "toggle";
  tokens?: Tokens<
    | "tree-root"
    | "tree-branch"
    | "tree-branch-content"
    | "tree-branch-label"
    | "tree-leaf"
    | "tree-leaf-content"
  >;
};

export type TreeEmits = {
  "update:modelValue": [TreeNode | TreeNode[]];
  "update:expanded": [string[]];
};

export const defineTree = useComponentRecipe<TreeProps, TreeEmits>();
