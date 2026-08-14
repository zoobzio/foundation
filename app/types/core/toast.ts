import type { IconProps } from "../common/icon";
import type {
  ToastRootProps,
  ToastRootEmits,
} from "../common/toast/root";
import type { ToastTitleProps } from "../common/toast/title";
import type { ToastDescriptionProps } from "../common/toast/description";
import type {
  ToastCloseProps,
  ToastCloseEmits,
} from "../common/toast/close";
import type { ComponentEvents } from "../events";
import type { Passthrough, PT } from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type ToastPassthrough = {
  root: Passthrough<ToastRootProps, ToastRootEmits>;
  title: Passthrough<ToastTitleProps>;
  description: Passthrough<ToastDescriptionProps>;
  close: Passthrough<ToastCloseProps, ToastCloseEmits>;
  closeIcon: Passthrough<IconProps>;
};

export type ToastProps = {
  title?: string;
  description?: string;
  open?: boolean;
  duration?: number;
  pt?: PT<ToastPassthrough>;
};

export type ToastEmits = ComponentEvents["toast"] & {
  "update:open": [value: boolean];
  close: [];
};

export type ToastContext = {
  title?: string;
  description?: string;
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
