import type { li } from "../../elements.config";

export type LiProps = {
  tokens?: Tokens<typeof li.key>;
};

export type LiEmits = {};

export const defineLi = useComponentRecipe<LiProps, LiEmits>();
