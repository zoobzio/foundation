export type UlProps = {
  tokens?: Tokens<"ul">;
};

export type UlEmits = {};

export const defineUl = useComponentRecipe<UlProps, UlEmits>();
