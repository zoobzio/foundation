import type { ToastProviderProps, ToastViewportProps } from "reka-ui";
import type { Passthrough, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { ComponentPublicInstance, VNode } from "vue";

/**
 * The parts of the toaster that accept passthrough.
 */
export type ToasterPassthrough = {
  provider: Passthrough<ToastProviderProps>;
  viewport: Passthrough<ToastViewportProps>;
};

/**
 * Props of the toaster.
 */
export type ToasterProps = {
  pt?: PT<ToasterPassthrough>;
};

/**
 * Emits of the toaster.
 */
export type ToasterEmits = {};

/**
 * The toaster view model, served to `defineExpose` and the slots.
 */
export type ToasterContext = {
  el: ComponentPublicInstance | null;
  settings: ToasterPassthrough;
};

/**
 * Slots of the toaster. Each slot receives the context.
 * The toasts slot renders inside the viewport.
 */
export type ToasterSlots = {
  toasts?: (props: ToasterContext) => VNode[];
  viewport?: (props: ToasterContext) => VNode[];
};

/**
 * A toaster instance as data: props plus emit listeners.
 */
export type ToasterDefinition = Definition<ToasterProps, ToasterEmits>;
