import type { h4 } from "../../elements.config";

export type H4Props = {
  tokens?: Tokens<typeof h4.key>;
};

export type H4Emits = {};

export const defineH4 = useComponentRecipe<H4Props, H4Emits>();
