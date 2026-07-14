import type { ButtonProps } from "#foundation/types/common/button";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Recipe } from "#foundation/types/core/recipe";
import type { ScrollAreaRootProps, ScrollAreaViewportProps, ScrollAreaScrollbarProps, ScrollAreaThumbProps, ScrollAreaCornerProps } from "reka-ui";

export type ScrollerPassthrough = {
  root?: Passthrough<ScrollAreaRootProps>;
  viewport?: Passthrough<ScrollAreaViewportProps>;
  scrollbar?: Passthrough<ScrollAreaScrollbarProps>;
  thumb?: Passthrough<ScrollAreaThumbProps>;
  corner?: Passthrough<ScrollAreaCornerProps>;
  backToTop?: Passthrough<ButtonProps>;
};

export type ScrollerProps = {
  type?: "always" | "scroll" | "hover" | "auto";
  scrollHideDelay?: number;
  dir?: "ltr" | "rtl";
  orientation?: "vertical" | "horizontal" | "both";
  pt?: ScrollerPassthrough;
};

export type ScrollerEmits = {};

export type ScrollerRecipe = Recipe<ScrollerProps, ScrollerEmits>;
