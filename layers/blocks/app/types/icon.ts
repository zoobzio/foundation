import type { icon } from "../../elements.config";

export type IconProps = {
  alias: IconAlias;
  tokens?: Tokens<typeof icon.key>;
};

export type IconEmits = {};

export const defineIcon = useComponentRecipe<IconProps, IconEmits>();
