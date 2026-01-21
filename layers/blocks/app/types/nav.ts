import type { nav } from "../../elements.config";

export type NavProps = {
  tokens?: Tokens<typeof nav.key>;
};

export type NavEmits = {};

export const defineNav = useComponentRecipe<NavProps, NavEmits>();
