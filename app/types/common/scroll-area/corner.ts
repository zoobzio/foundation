import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  ScrollAreaCornerProps as RekaScrollAreaCornerProps,
} from "reka-ui";

export type ScrollAreaCornerForward = Reshape<RekaScrollAreaCornerProps>;

export type ScrollAreaCornerProps = RekaScrollAreaCornerProps & {
  modifiers?: ModifierProps<"scroll-area-corner">;
  tokens?: TokenProps<"scroll-area-corner">;
  aria?: AriaProps<"scroll-area-corner">;
};

export type ScrollAreaCornerEmits = ComponentEvents["scroll-area-corner"];

export type ScrollAreaCornerBindings = Bindings<"scroll-area-corner", ScrollAreaCornerForward>;

export type ScrollAreaCornerContext = Reshape<ScrollAreaCornerProps> & {
  bindings: ScrollAreaCornerBindings;
  el: ComponentPublicInstance | null;
};

export type ScrollAreaCornerSlots = {
  default(props: ScrollAreaCornerContext): VNode[];
};
