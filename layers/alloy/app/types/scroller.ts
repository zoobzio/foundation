import type { ScrollAreaRootProps, ScrollAreaViewportProps, ScrollAreaScrollbarProps, ScrollAreaThumbProps, ScrollAreaCornerProps } from "reka-ui";

export type ScrollerPassthrough = {
  root?: Passthrough<ScrollAreaRootProps>;
  viewport?: Passthrough<ScrollAreaViewportProps>;
  scrollbar?: Passthrough<ScrollAreaScrollbarProps>;
  thumb?: Passthrough<ScrollAreaThumbProps>;
  corner?: Passthrough<ScrollAreaCornerProps>;
};

export type ScrollerProps = {
  type?: "always" | "scroll" | "hover" | "auto";
  scrollHideDelay?: number;
  dir?: "ltr" | "rtl";
  orientation?: "vertical" | "horizontal" | "both";
  pt?: ScrollerPassthrough;
};

export type ScrollerEmits = {};

export const defineScroller = defineComponentRecipe<ScrollerProps, ScrollerEmits>();

export type ScrollerRecipe = Recipe<ScrollerProps, ScrollerEmits>;
