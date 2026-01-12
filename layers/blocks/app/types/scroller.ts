export type ScrollerProps = {
  type?: "always" | "scroll" | "hover" | "auto";
  scrollHideDelay?: number;
  dir?: "ltr" | "rtl";
  orientation?: "vertical" | "horizontal" | "both";
};

export type ScrollerEmits = {};

export const defineScroller = useComponentRecipe<ScrollerProps, ScrollerEmits>();
