import type { th } from "../../elements.config";

export type ThProps = {
  tokens?: Tokens<typeof th.key>;
};

export type ThEmits = {};

export const defineTh = useComponentRecipe<ThProps, ThEmits>();
