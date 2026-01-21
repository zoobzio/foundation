import type { card } from "../../elements.config";

export type CardProps = {
  tokens?: Tokens<typeof card.key>;
};

export type CardEmits = {};

export const defineCard = useComponentRecipe<CardProps, CardEmits>();
