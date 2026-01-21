import type { td } from "../../elements.config";

export type TdProps = {
  tokens?: Tokens<typeof td.key>;
};

export type TdEmits = {};

export const defineTd = useComponentRecipe<TdProps, TdEmits>();
