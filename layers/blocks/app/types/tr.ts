import type { tr } from "../../elements.config";

export type TrProps = {
  tokens?: Tokens<typeof tr.key>;
};

export type TrEmits = {};

export const defineTr = useComponentRecipe<TrProps, TrEmits>();
