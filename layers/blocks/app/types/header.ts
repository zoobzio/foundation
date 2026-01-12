export type HeaderProps = {
  tokens?: Tokens<"header">;
};

export type HeaderEmits = {};

export const defineHeader = useComponentRecipe<HeaderProps, HeaderEmits>();
