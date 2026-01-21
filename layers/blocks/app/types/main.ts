import type { main } from "../../elements.config";

export type MainProps = {
  tokens?: Tokens<typeof main.key>;
};

export type MainEmits = {};

export const defineMain = useComponentRecipe<MainProps, MainEmits>();
