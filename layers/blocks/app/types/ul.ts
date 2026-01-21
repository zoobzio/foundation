import type { ul } from "../../elements.config";

export type UlProps = {
  tokens?: Tokens<typeof ul.key>;
};

export type UlEmits = {};

export const defineUl = useComponentRecipe<UlProps, UlEmits>();
