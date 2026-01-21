import type { thead } from "../../elements.config";

export type TheadProps = {
  tokens?: Tokens<typeof thead.key>;
};

export type TheadEmits = {};

export const defineThead = useComponentRecipe<TheadProps, TheadEmits>();
