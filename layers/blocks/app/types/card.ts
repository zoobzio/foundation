export type CardProps = {
  tokens?: Tokens<"card">;
};

export type CardEmits = {};

export const defineCard = useComponentRecipe<CardProps, CardEmits>();
