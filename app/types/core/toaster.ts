import type { ToastProviderProps, ToastViewportProps } from "reka-ui";
import type { Passthrough, PT } from "../passthrough";
import type { ComponentPublicInstance, VNode } from "vue";

export type ToasterPassthrough = {
  provider: Passthrough<ToastProviderProps>;
  viewport: Passthrough<ToastViewportProps>;
};

export type ToasterProps = {
  pt?: PT<ToasterPassthrough>;
};

export type ToasterEmits = {};

export type ToasterContext = {
  el: ComponentPublicInstance | null;
  settings: ToasterPassthrough;
};

export type ToasterSlots = {
  toasts?: (props: ToasterContext) => VNode[];
  viewport?: (props: ToasterContext) => VNode[];
};
