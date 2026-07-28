import type { IconProps } from "#foundation/types/common/icon";
import type {
  ToastRootProps,
  ToastRootEmits,
} from "#foundation/types/common/toast/root";
import type { ToastTitleProps } from "#foundation/types/common/toast/title";
import type { ToastDescriptionProps } from "#foundation/types/common/toast/description";
import type {
  ToastCloseProps,
  ToastCloseEmits,
} from "#foundation/types/common/toast/close";
import type { ComponentEvents } from "#foundation/types/events";
import type { Passthrough, PT } from "#foundation/types/passthrough";
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
