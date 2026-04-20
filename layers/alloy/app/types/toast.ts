import type { ToastRootProps, ToastTitleProps, ToastDescriptionProps, ToastCloseProps } from "reka-ui";

export type ToastPassthrough = {
  root?: Passthrough<ToastRootProps>;
  title?: Passthrough<ToastTitleProps>;
  description?: Passthrough<ToastDescriptionProps>;
  close?: Passthrough<ToastCloseProps>;
};

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "info" | "success" | "warning" | "error";
  duration?: number;
  pt?: ToastPassthrough;
};

export type ToastEmits = {
  close: [];
};

export const defineToast = useComponentRecipe<ToastProps, ToastEmits>();

export type ToastRecipe = ComponentRecipe<ToastProps, ToastEmits>;
