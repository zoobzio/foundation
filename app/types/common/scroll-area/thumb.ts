import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  ScrollAreaThumbProps as RekaScrollAreaThumbProps,
} from "reka-ui";

export type ScrollAreaThumbForward = Reshape<RekaScrollAreaThumbProps>;

export type ScrollAreaThumbProps = RekaScrollAreaThumbProps & {
  modifiers?: ModifierProps<"scroll-area-thumb">;
  tokens?: TokenProps<"scroll-area-thumb">;
  aria?: AriaProps<"scroll-area-thumb">;
};

export type ScrollAreaThumbEmits = {};

export type ScrollAreaThumbBindings = Bindings<"scroll-area-thumb", ScrollAreaThumbForward>;

export type ScrollAreaThumbContext = Reshape<ScrollAreaThumbProps> & {
  bindings: ScrollAreaThumbBindings;
  el: ComponentPublicInstance | null;
};

export type ScrollAreaThumbSlots = {
  default(props: ScrollAreaThumbContext): VNode[];
};
