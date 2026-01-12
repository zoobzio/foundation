export type TrProps = {
  tokens?: Tokens<"tr">;
};

export type TrEmits = {};

export const defineTr = useComponentRecipe<TrProps, TrEmits>();
