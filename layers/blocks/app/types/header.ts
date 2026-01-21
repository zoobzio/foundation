import type { header } from "../../elements.config";

export type HeaderProps = {
  tokens?: Tokens<typeof header.key>;
};

export type HeaderEmits = {};

export const defineHeader = useComponentRecipe<HeaderProps, HeaderEmits>();
