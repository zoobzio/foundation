export type LiProps = {
  tokens?: Tokens<"li">;
};

export type LiEmits = {};

export const defineLi = useComponentRecipe<LiProps, LiEmits>();
