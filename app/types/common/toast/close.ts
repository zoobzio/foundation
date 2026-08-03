import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { Reshape } from "#foundation/types/reshape";
import type { TokenProps } from "#foundation/types/tokens";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  ToastCloseProps as RekaToastCloseProps,
} from "reka-ui";

export type ToastCloseForward = Reshape<RekaToastCloseProps>;

export type ToastCloseProps = RekaToastCloseProps & {
  modifiers?: ModifierProps<"toast-close">;
  tokens?: TokenProps<"toast-close">;
  aria?: AriaProps<"toast-close">;
};

export type ToastCloseEmits = ComponentEvents["toast-close"];

export type ToastCloseBindings = Bindings<"toast-close", ToastCloseForward>;

export type ToastCloseContext = Reshape<ToastCloseProps> & {
  bindings: ToastCloseBindings;
  el: ComponentPublicInstance | null;
};

export type ToastCloseSlots = {
  default(props: ToastCloseContext): VNode[];
};
