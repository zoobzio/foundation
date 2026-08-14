import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  ScrollAreaViewportProps as RekaScrollAreaViewportProps,
} from "reka-ui";

export type ScrollAreaViewportForward = Reshape<RekaScrollAreaViewportProps>;

export type ScrollAreaViewportProps = RekaScrollAreaViewportProps & {
  modifiers?: ModifierProps<"scroll-area-viewport">;
  tokens?: TokenProps<"scroll-area-viewport">;
  aria?: AriaProps<"scroll-area-viewport">;
};

export type ScrollAreaViewportEmits = {};

export type ScrollAreaViewportBindings = Bindings<"scroll-area-viewport", ScrollAreaViewportForward>;

export type ScrollAreaViewportContext = Reshape<ScrollAreaViewportProps> & {
  bindings: ScrollAreaViewportBindings;
  el: ComponentPublicInstance | null;
};

export type ScrollAreaViewportSlots = {
  default(props: ScrollAreaViewportContext): VNode[];
};
