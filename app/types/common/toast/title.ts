import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { Reshape } from "../../reshape";
import type { TokenProps } from "../../tokens";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  ToastTitleProps as RekaToastTitleProps,
} from "reka-ui";

export type ToastTitleForward = Reshape<RekaToastTitleProps>;

export type ToastTitleProps = RekaToastTitleProps & {
  modifiers?: ModifierProps<"toast-title">;
  tokens?: TokenProps<"toast-title">;
  aria?: AriaProps<"toast-title">;
};

export type ToastTitleEmits = ComponentEvents["toast-title"];

export type ToastTitleBindings = Bindings<"toast-title", ToastTitleForward>;

export type ToastTitleContext = Reshape<ToastTitleProps> & {
  bindings: ToastTitleBindings;
  el: ComponentPublicInstance | null;
};

export type ToastTitleSlots = {
  default(props: ToastTitleContext): VNode[];
};
