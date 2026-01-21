import type { aside } from "../../elements.config";

export type AsideProps = {
  tokens?: Tokens<typeof aside.key>;
};

export type AsideEmits = {};

export const defineAside = useComponentRecipe<AsideProps, AsideEmits>();
