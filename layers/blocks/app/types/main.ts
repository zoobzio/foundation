export type MainProps = {
  tokens?: Tokens<"main">;
};

export type MainEmits = {};

export const defineMain = useComponentRecipe<MainProps, MainEmits>();
