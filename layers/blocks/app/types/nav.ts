export type NavProps = {
  tokens?: Tokens<"nav">;
};

export type NavEmits = {};

export const defineNav = useComponentRecipe<NavProps, NavEmits>();
