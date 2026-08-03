import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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

export type ScrollAreaThumbEmits = ComponentEvents["scroll-area-thumb"];

export type ScrollAreaThumbBindings = Bindings<"scroll-area-thumb", ScrollAreaThumbForward>;

export type ScrollAreaThumbContext = Reshape<ScrollAreaThumbProps> & {
  bindings: ScrollAreaThumbBindings;
  el: ComponentPublicInstance | null;
};

export type ScrollAreaThumbSlots = {
  default(props: ScrollAreaThumbContext): VNode[];
};
