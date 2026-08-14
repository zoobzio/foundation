import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { Reshape } from "../../reshape";
import type { TokenProps } from "../../tokens";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  ToastDescriptionProps as RekaToastDescriptionProps,
} from "reka-ui";

export type ToastDescriptionForward = Reshape<RekaToastDescriptionProps>;

export type ToastDescriptionProps = RekaToastDescriptionProps & {
  modifiers?: ModifierProps<"toast-description">;
  tokens?: TokenProps<"toast-description">;
  aria?: AriaProps<"toast-description">;
};

export type ToastDescriptionEmits = {};

export type ToastDescriptionBindings = Bindings<"toast-description", ToastDescriptionForward>;

export type ToastDescriptionContext = Reshape<ToastDescriptionProps> & {
  bindings: ToastDescriptionBindings;
  el: ComponentPublicInstance | null;
};

export type ToastDescriptionSlots = {
  default(props: ToastDescriptionContext): VNode[];
};
