import type { strong } from "../../elements.config";

export type StrongProps = {
  tokens?: Tokens<typeof strong.key>;
};

export type StrongEmits = {};

export const defineStrong = useComponentRecipe<StrongProps, StrongEmits>();
