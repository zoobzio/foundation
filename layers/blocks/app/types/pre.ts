import type { pre } from "../../elements.config";

export type PreProps = {
  tokens?: Tokens<typeof pre.key>;
};

export type PreEmits = {};

export const definePre = useComponentRecipe<PreProps, PreEmits>();
