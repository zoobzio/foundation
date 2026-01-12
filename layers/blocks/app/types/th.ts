export type ThProps = {
  tokens?: Tokens<"th">;
};

export type ThEmits = {};

export const defineTh = useComponentRecipe<ThProps, ThEmits>();
