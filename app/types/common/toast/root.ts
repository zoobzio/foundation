import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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

export type ToastRootEmits = RekaToastRootEmits & ComponentEvents["toast-root"];

export type ToastRootBindings = Bindings<"toast-root", ToastRootForward>;

export type ToastRootContext = Reshape<ToastRootProps, "open"> & {
  open: Ref<boolean | undefined>;
  bindings: ToastRootBindings;
  el: ComponentPublicInstance | null;
};

export type ToastRootSlots = {
  default(props: ToastRootContext): VNode[];
};
