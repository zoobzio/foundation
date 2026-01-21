import type { h1 } from "../../elements.config";

export type H1Props = {
  tokens?: Tokens<typeof h1.key>;
};

export type H1Emits = {};

export const defineH1 = useComponentRecipe<H1Props, H1Emits>();
