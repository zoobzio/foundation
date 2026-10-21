import type {
  ScrollAreaRootProps,
  ScrollAreaViewportProps,
  ScrollAreaScrollbarProps,
  ScrollAreaThumbProps,
  ScrollAreaCornerProps,
} from "reka-ui";
import type { Passthrough, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { ComponentPublicInstance, VNode } from "vue";

/**
 * When the scrollbars show.
 */
export type ScrollerType = "always" | "scroll" | "hover" | "auto";
/**
 * The reading direction of the scroller.
 */
export type ScrollerDir = "ltr" | "rtl";
/**
 * The axes the scroller scrolls on.
 */
export type ScrollerOrientation = "vertical" | "horizontal" | "both";

/**
 * The parts of the scroller that accept passthrough.
 */
export type ScrollerPassthrough = {
  root: Passthrough<ScrollAreaRootProps>;
  viewport: Passthrough<ScrollAreaViewportProps>;
  scrollbar: Passthrough<ScrollAreaScrollbarProps>;
  thumb: Passthrough<ScrollAreaThumbProps>;
  corner: Passthrough<ScrollAreaCornerProps>;
};

/**
 * Props of the scroller. `scrollHideDelay` is in milliseconds.
 */
export type ScrollerProps = {
  type?: ScrollerType;
  scrollHideDelay?: number;
  dir?: ScrollerDir;
  orientation?: ScrollerOrientation;
  pt?: PT<ScrollerPassthrough>;
};

/**
 * Emits of the scroller.
 */
export type ScrollerEmits = {};

/**
 * The scroller view model, served to `defineExpose` and the slots.
 * `isScrolled` is true once the viewport scrolls past the top.
 */
export type ScrollerContext = {
  type: ScrollerType;
  scrollHideDelay: number;
  dir?: ScrollerDir;
  orientation: ScrollerOrientation;
  isScrolled: boolean;
  el: ComponentPublicInstance | null;
  settings: ScrollerPassthrough;
};

/**
 * Slots of the scroller. Each slot receives the context.
 * The scrollbar slot also receives its `orientation`.
 */
export type ScrollerSlots = {
  default?: (props: ScrollerContext) => VNode[];
  viewport?: (props: ScrollerContext) => VNode[];
  scrollbar?: (
    props: ScrollerContext & { orientation: "vertical" | "horizontal" },
  ) => VNode[];
  thumb?: (props: ScrollerContext) => VNode[];
  corner?: (props: ScrollerContext) => VNode[];
  backToTop?: (props: ScrollerContext) => VNode[];
  backToTopIcon?: (props: ScrollerContext) => VNode[];
};

/**
 * A scroller instance as data: props plus emit listeners.
 */
export type ScrollerDefinition = Definition<ScrollerProps, ScrollerEmits>;
