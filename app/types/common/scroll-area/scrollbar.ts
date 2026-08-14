import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  ScrollAreaScrollbarProps as RekaScrollAreaScrollbarProps,
} from "reka-ui";

export type ScrollAreaScrollbarForward = Reshape<RekaScrollAreaScrollbarProps>;

export type ScrollAreaScrollbarProps = RekaScrollAreaScrollbarProps & {
  modifiers?: ModifierProps<"scroll-area-scrollbar">;
  tokens?: TokenProps<"scroll-area-scrollbar">;
  aria?: AriaProps<"scroll-area-scrollbar">;
};

export type ScrollAreaScrollbarEmits = {};

export type ScrollAreaScrollbarBindings = Bindings<"scroll-area-scrollbar", ScrollAreaScrollbarForward>;

export type ScrollAreaScrollbarContext = Reshape<ScrollAreaScrollbarProps> & {
  bindings: ScrollAreaScrollbarBindings;
  el: ComponentPublicInstance | null;
};

export type ScrollAreaScrollbarSlots = {
  default(props: ScrollAreaScrollbarContext): VNode[];
};
