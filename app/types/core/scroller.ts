import type {
  ScrollAreaRootProps,
  ScrollAreaViewportProps,
  ScrollAreaScrollbarProps,
  ScrollAreaThumbProps,
  ScrollAreaCornerProps,
} from "reka-ui";
import type { Passthrough, PT } from "../passthrough";
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
};

export type ScrollerProps = {
  type?: ScrollerType;
  scrollHideDelay?: number;
  dir?: ScrollerDir;
  orientation?: ScrollerOrientation;
  pt?: PT<ScrollerPassthrough>;
};

export type ScrollerEmits = {};

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
