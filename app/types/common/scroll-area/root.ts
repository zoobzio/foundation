import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  ScrollAreaRootProps as RekaScrollAreaRootProps,
} from "reka-ui";

export type ScrollAreaRootForward = Reshape<RekaScrollAreaRootProps>;

export type ScrollAreaRootProps = RekaScrollAreaRootProps & {
  modifiers?: ModifierProps<"scroll-area-root">;
  tokens?: TokenProps<"scroll-area-root">;
  aria?: AriaProps<"scroll-area-root">;
};

export type ScrollAreaRootEmits = ComponentEvents["scroll-area-root"];

export type ScrollAreaRootBindings = Bindings<"scroll-area-root", ScrollAreaRootForward>;

export type ScrollAreaRootContext = Reshape<ScrollAreaRootProps> & {
  bindings: ScrollAreaRootBindings;
  el: ComponentPublicInstance | null;
};

export type ScrollAreaRootSlots = {
  default(props: ScrollAreaRootContext): VNode[];
};
