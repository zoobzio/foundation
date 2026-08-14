import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { Reshape } from "../../reshape";
import type { TokenProps } from "../../tokens";
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
