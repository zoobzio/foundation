import type { h2 } from "../../elements.config";

export type H2Props = {
  tokens?: Tokens<typeof h2.key>;
};

export type H2Emits = {};

export const defineH2 = useComponentRecipe<H2Props, H2Emits>();
