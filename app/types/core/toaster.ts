import type { ToastProviderProps } from "#foundation/types/common/toast/provider";
import type { ToastViewportProps } from "#foundation/types/common/toast/viewport";
import type { ComponentEvents } from "#foundation/types/events";
import type { Passthrough, PT } from "#foundation/types/passthrough";
import type { ComponentPublicInstance, VNode } from "vue";

export type ToasterPassthrough = {
  provider: Passthrough<ToastProviderProps>;
  viewport: Passthrough<ToastViewportProps>;
};

export type ToasterProps = {
  pt?: PT<ToasterPassthrough>;
};

export type ToasterEmits = ComponentEvents["toaster"];

export type ToasterContext = {
  el: ComponentPublicInstance | null;
  settings: ToasterPassthrough;
};

export type ToasterSlots = {
  toasts?: (props: ToasterContext) => VNode[];
  viewport?: (props: ToasterContext) => VNode[];
};
