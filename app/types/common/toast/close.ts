import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { EventEmits } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { Reshape } from "../../reshape";
import type { TokenProps } from "../../tokens";
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

export type ToastCloseEmits = EventEmits<"click">;

export type ToastCloseBindings = Bindings<"toast-close", ToastCloseForward>;

export type ToastCloseContext = Reshape<ToastCloseProps> & {
  bindings: ToastCloseBindings;
  el: ComponentPublicInstance | null;
};

export type ToastCloseSlots = {
  default(props: ToastCloseContext): VNode[];
};
