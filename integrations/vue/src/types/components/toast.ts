import type {
  ToastRootProps,
  ToastRootEmits,
  ToastTitleProps,
  ToastDescriptionProps,
  ToastCloseProps,
} from "reka-ui";
import type { Passthrough, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

/**
 * The tone of a toast.
 */
export type ToastVariant = "info" | "success" | "warning" | "error";

/**
 * The parts of the toast that accept passthrough.
 */
export type ToastPassthrough = {
  root: Passthrough<ToastRootProps, ToastRootEmits>;
  title: Passthrough<ToastTitleProps>;
  description: Passthrough<ToastDescriptionProps>;
  close: Passthrough<ToastCloseProps>;
};

/**
 * Props of the toast. `duration` is in milliseconds.
 */
export type ToastProps = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  open?: boolean;
  duration?: number;
  pt?: PT<ToastPassthrough>;
};

/**
 * Emits of the toast. `close` fires when the close control is activated.
 */
export type ToastEmits = {
  "update:open": [value: boolean];
  close: [];
};

/**
 * The toast view model, served to `defineExpose` and the slots.
 */
export type ToastContext = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  open: Ref<boolean>;
  el: ComponentPublicInstance | null;
  settings: ToastPassthrough;
};

/**
 * Slots of the toast. Each slot receives the context.
 */
export type ToastSlots = {
  title?: (props: ToastContext) => VNode[];
  description?: (props: ToastContext) => VNode[];
  close?: (props: ToastContext) => VNode[];
  closePrepend?: (props: ToastContext) => VNode[];
  closeAppend?: (props: ToastContext) => VNode[];
};

/**
 * A toast instance as data: props plus emit listeners.
 */
export type ToastDefinition = Definition<ToastProps, ToastEmits>;
