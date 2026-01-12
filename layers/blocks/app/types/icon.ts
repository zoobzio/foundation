export type IconProps = {
  alias: IconAlias;
  tokens?: Tokens<"icon">;
};

export type IconEmits = {};

export const defineIcon = useComponentRecipe<IconProps, IconEmits>();
