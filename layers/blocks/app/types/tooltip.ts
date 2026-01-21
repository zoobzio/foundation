import type { tooltip } from "../../elements.config";

export type TooltipProps = {
  content?: string;
  delayDuration?: number;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  tokens?: Tokens<typeof tooltip.content>;
};

export type TooltipEmits = {};

export const defineTooltip = useComponentRecipe<TooltipProps, TooltipEmits>();
