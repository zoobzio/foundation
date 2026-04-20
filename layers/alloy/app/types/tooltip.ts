import type { TooltipRootProps, TooltipContentProps } from "reka-ui";

export type TooltipPassthrough = {
  root?: Passthrough<TooltipRootProps>;
  content?: Passthrough<TooltipContentProps>;
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

export const defineTooltip = useComponentRecipe<TooltipProps, TooltipEmits>();

export type TooltipRecipe = ComponentRecipe<TooltipProps, TooltipEmits>;
