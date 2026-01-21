import type { em } from "../../elements.config";

export type EmProps = {
  tokens?: Tokens<typeof em.key>;
};

export type EmEmits = {};

export const defineEm = useComponentRecipe<EmProps, EmEmits>();
