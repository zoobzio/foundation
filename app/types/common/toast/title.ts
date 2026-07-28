import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { Reshape } from "#foundation/types/reshape";
import type { TokenProps } from "#foundation/types/tokens";
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
