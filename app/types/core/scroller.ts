import type { ScrollAreaRootProps } from "#foundation/types/common/scroll-area/root";
import type { ScrollAreaViewportProps } from "#foundation/types/common/scroll-area/viewport";
import type { ScrollAreaScrollbarProps } from "#foundation/types/common/scroll-area/scrollbar";
import type { ScrollAreaThumbProps } from "#foundation/types/common/scroll-area/thumb";
import type { ScrollAreaCornerProps } from "#foundation/types/common/scroll-area/corner";
import type { ButtonEmits, ButtonProps } from "#foundation/types/common/button";
import type { ComponentEvents } from "#foundation/types/events";
import type { Passthrough, PT } from "#foundation/types/passthrough";
import type { ComponentPublicInstance, VNode } from "vue";

export type ScrollerType = "always" | "scroll" | "hover" | "auto";
export type ScrollerDir = "ltr" | "rtl";
export type ScrollerOrientation = "vertical" | "horizontal" | "both";

export type ScrollerPassthrough = {
  root: Passthrough<ScrollAreaRootProps>;
  viewport: Passthrough<ScrollAreaViewportProps>;
  scrollbar: Passthrough<ScrollAreaScrollbarProps>;
  thumb: Passthrough<ScrollAreaThumbProps>;
  corner: Passthrough<ScrollAreaCornerProps>;
  backToTop: Passthrough<ButtonProps, ButtonEmits>;
};

export type ScrollerProps = {
  type?: ScrollerType;
  scrollHideDelay?: number;
  dir?: ScrollerDir;
  orientation?: ScrollerOrientation;
  pt?: PT<ScrollerPassthrough>;
};

export type ScrollerEmits = ComponentEvents["scroller"];

export type ScrollerContext = {
  type: ScrollerType;
  scrollHideDelay: number;
  dir?: ScrollerDir;
  orientation: ScrollerOrientation;
  isScrolled: boolean;
  el: ComponentPublicInstance | null;
  settings: ScrollerPassthrough;
};

export type ScrollerSlots = {
  default?: (props: ScrollerContext) => VNode[];
  viewport?: (props: ScrollerContext) => VNode[];
  scrollbar?: (props: ScrollerContext & { orientation: "vertical" | "horizontal" }) => VNode[];
  thumb?: (props: ScrollerContext) => VNode[];
  corner?: (props: ScrollerContext) => VNode[];
  backToTop?: (props: ScrollerContext) => VNode[];
};
