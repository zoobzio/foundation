export type DelProps = {
  tokens?: Tokens<"del">;
};

export type DelEmits = {};

export const defineDel = useComponentRecipe<DelProps, DelEmits>();
