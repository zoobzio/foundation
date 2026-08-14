import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  ToastRootEmits as RekaToastRootEmits,
  ToastRootProps as RekaToastRootProps,
} from "reka-ui";

export type ToastRootForward = Reshape<RekaToastRootProps, "open">;

export type ToastRootProps = RekaToastRootProps & {
  modifiers?: ModifierProps<"toast-root">;
  tokens?: TokenProps<"toast-root">;
  aria?: AriaProps<"toast-root">;
};

export type ToastRootEmits = RekaToastRootEmits & {};

export type ToastRootBindings = Bindings<"toast-root", ToastRootForward>;

export type ToastRootContext = Reshape<ToastRootProps, "open"> & {
  open: Ref<boolean | undefined>;
  bindings: ToastRootBindings;
  el: ComponentPublicInstance | null;
};

export type ToastRootSlots = {
  default(props: ToastRootContext): VNode[];
};
