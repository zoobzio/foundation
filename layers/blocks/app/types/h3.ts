import type { h3 } from "../../elements.config";

export type H3Props = {
  tokens?: Tokens<typeof h3.key>;
};

export type H3Emits = {};

export const defineH3 = useComponentRecipe<H3Props, H3Emits>();
