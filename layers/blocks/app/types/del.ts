import type { del } from "../../elements.config";

export type DelProps = {
  tokens?: Tokens<typeof del.key>;
};

export type DelEmits = {};

export const defineDel = useComponentRecipe<DelProps, DelEmits>();
