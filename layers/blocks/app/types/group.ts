export type GroupProps = {
  tokens?: Tokens<"group">;
};

export type GroupEmits = {};

export const defineGroup = useComponentRecipe<GroupProps, GroupEmits>();
