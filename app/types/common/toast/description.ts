import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { Reshape } from "#foundation/types/reshape";
import type { TokenProps } from "#foundation/types/tokens";
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

export type ToastDescriptionEmits = ComponentEvents["toast-description"];

export type ToastDescriptionBindings = Bindings<"toast-description", ToastDescriptionForward>;

export type ToastDescriptionContext = Reshape<ToastDescriptionProps> & {
  bindings: ToastDescriptionBindings;
  el: ComponentPublicInstance | null;
};

export type ToastDescriptionSlots = {
  default(props: ToastDescriptionContext): VNode[];
};
