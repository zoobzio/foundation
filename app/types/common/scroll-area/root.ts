import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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

export type ScrollAreaRootEmits = {};

export type ScrollAreaRootBindings = Bindings<"scroll-area-root", ScrollAreaRootForward>;

export type ScrollAreaRootContext = Reshape<ScrollAreaRootProps> & {
  bindings: ScrollAreaRootBindings;
  el: ComponentPublicInstance | null;
};

export type ScrollAreaRootSlots = {
  default(props: ScrollAreaRootContext): VNode[];
};
