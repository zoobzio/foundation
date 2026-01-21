import type { h5 } from "../../elements.config";

export type H5Props = {
  tokens?: Tokens<typeof h5.key>;
};

export type H5Emits = {};

export const defineH5 = useComponentRecipe<H5Props, H5Emits>();
