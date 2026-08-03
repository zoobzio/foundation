import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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

export type ScrollAreaScrollbarEmits = ComponentEvents["scroll-area-scrollbar"];

export type ScrollAreaScrollbarBindings = Bindings<"scroll-area-scrollbar", ScrollAreaScrollbarForward>;

export type ScrollAreaScrollbarContext = Reshape<ScrollAreaScrollbarProps> & {
  bindings: ScrollAreaScrollbarBindings;
  el: ComponentPublicInstance | null;
};

export type ScrollAreaScrollbarSlots = {
  default(props: ScrollAreaScrollbarContext): VNode[];
};
