import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { Reshape } from "#foundation/types/reshape";
import type { TokenProps } from "#foundation/types/tokens";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  ToastViewportProps as RekaToastViewportProps,
} from "reka-ui";

export type ToastViewportForward = Reshape<RekaToastViewportProps>;

export type ToastViewportProps = RekaToastViewportProps & {
  modifiers?: ModifierProps<"toast-viewport">;
  tokens?: TokenProps<"toast-viewport">;
  aria?: AriaProps<"toast-viewport">;
};

export type ToastViewportEmits = ComponentEvents["toast-viewport"];

export type ToastViewportBindings = Bindings<"toast-viewport", ToastViewportForward>;

export type ToastViewportContext = Reshape<ToastViewportProps> & {
  bindings: ToastViewportBindings;
  el: ComponentPublicInstance | null;
};

export type ToastViewportSlots = {
  default(props: ToastViewportContext): VNode[];
};
