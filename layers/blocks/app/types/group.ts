import type { group } from "../../elements.config";

export type GroupProps = {
  tokens?: Tokens<typeof group.key>;
};

export type GroupEmits = {};

export const defineGroup = useComponentRecipe<GroupProps, GroupEmits>();
