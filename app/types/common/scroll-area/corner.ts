import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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
