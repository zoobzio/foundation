import type { h6 } from "../../elements.config";

export type H6Props = {
  tokens?: Tokens<typeof h6.key>;
};

export type H6Emits = {};

export const defineH6 = useComponentRecipe<H6Props, H6Emits>();
