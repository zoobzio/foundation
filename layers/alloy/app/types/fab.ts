import type { PrimitiveProps } from "reka-ui";

export type FabPassthrough = {
  root?: Passthrough<PrimitiveProps & Partial<Link & ButtonProps>>;
  tooltip?: Passthrough<TooltipProps>;
  icon?: Passthrough<IconProps>;
  badge?: Passthrough<GroupProps>;
};

export type FabProps = {
  icon?: IconAlias;
  label?: string;
  type?: "button" | "submit" | "reset";
  link?: Link;
  disabled?: boolean;

  badge?: number | string;
  pt?: FabPassthrough;
};

export type FabEmits = {};

export type FabRecipe = Recipe<FabProps, FabEmits>;
