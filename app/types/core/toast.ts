import type {
  ToastRootProps,
  ToastRootEmits,
  ToastTitleProps,
  ToastDescriptionProps,
  ToastCloseProps,
} from "reka-ui";
import type { Passthrough, PT } from "../passthrough";
import type { ModifierAxesOptions } from "../modifiers";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type ToastPassthrough = {
  root: Passthrough<ToastRootProps, ToastRootEmits>;
  title: Passthrough<ToastTitleProps>;
  description: Passthrough<ToastDescriptionProps>;
  close: Passthrough<ToastCloseProps>;
};

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: ModifierAxesOptions<"toast-root", "variant">;
  open?: boolean;
  duration?: number;
  pt?: PT<ToastPassthrough>;
};

export type ToastEmits = {
  "update:open": [value: boolean];
  close: [];
};

export type ToastContext = {
  title?: string;
  description?: string;
  variant?: ModifierAxesOptions<"toast-root", "variant">;
  duration?: number;
  open: Ref<boolean | undefined>;
  el: ComponentPublicInstance | null;
  settings: ToastPassthrough;
};

export type ToastSlots = {
  title?: (props: ToastContext) => VNode[];
  description?: (props: ToastContext) => VNode[];
  close?: (props: ToastContext) => VNode[];
  closeIcon?: (props: ToastContext) => VNode[];
};
