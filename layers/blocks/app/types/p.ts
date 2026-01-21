import type { p } from "../../elements.config";

export type PProps = {
  tokens?: Tokens<typeof p.key>;
};

export type PEmits = {};

export const defineP = useComponentRecipe<PProps, PEmits>();
