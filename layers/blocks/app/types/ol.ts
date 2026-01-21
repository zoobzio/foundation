import type { ol } from "../../elements.config";

export type OlProps = {
  tokens?: Tokens<typeof ol.key>;
};

export type OlEmits = {};

export const defineOl = useComponentRecipe<OlProps, OlEmits>();
