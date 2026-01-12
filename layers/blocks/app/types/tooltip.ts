export type TooltipProps = {
  content?: string;
  delayDuration?: number;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  tokens?: Tokens<"tooltip-content">;
};

export type TooltipEmits = {};

export const defineTooltip = useComponentRecipe<TooltipProps, TooltipEmits>();
