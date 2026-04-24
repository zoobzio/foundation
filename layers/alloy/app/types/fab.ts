import type { PrimitiveProps } from "reka-ui";

export type FabPassthrough = {
  root?: Passthrough<PrimitiveProps & Partial<Link & ButtonProps>>;
  badge?: Passthrough<GroupProps>;
};

export type FabProps = {
  icon?: IconAlias;
  label?: string;
  type?: "button" | "submit" | "reset";
  link?: Link;
  disabled?: boolean;
  shortcut?: ButtonShortcut;
  badge?: number | string;
  pt?: FabPassthrough;
};

export type FabEmits = {};

export const defineFab = defineComponentRecipe<FabProps, FabEmits>();

export type FabRecipe = Recipe<FabProps, FabEmits>;
