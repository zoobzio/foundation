import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Recipe } from "#foundation/types/core/recipe";
import type { TooltipRootProps, TooltipRootEmits, TooltipContentProps, TooltipContentEmits } from "reka-ui";

export type TooltipPassthrough = {
  root?: Passthrough<TooltipRootProps, TooltipRootEmits>;
  content?: Passthrough<TooltipContentProps, TooltipContentEmits>;
};

export type TooltipProps = {
  content?: string;
  delayDuration?: number;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  pt?: TooltipPassthrough;
};

export type TooltipEmits = {};

export type TooltipRecipe = Recipe<TooltipProps, TooltipEmits>;
