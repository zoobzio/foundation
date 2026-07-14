import type { ButtonProps } from "#foundation/types/common/button";
import type { GroupProps } from "#foundation/types/common/group";
import type { IconProps } from "#foundation/types/common/icon";
import type { IconAlias } from "#foundation/types/common/iconic";
import type { Link } from "#foundation/types/core/common";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Recipe } from "#foundation/types/core/recipe";
import type { TooltipProps } from "#foundation/types/core/tooltip";
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
