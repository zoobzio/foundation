import type { IconProps } from "#foundation/types/common/icon";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Recipe } from "#foundation/types/core/recipe";
import type { ToastRootProps, ToastRootEmits, ToastTitleProps, ToastDescriptionProps, ToastCloseProps } from "reka-ui";

export type ToastPassthrough = {
  root?: Passthrough<ToastRootProps, ToastRootEmits>;
  title?: Passthrough<ToastTitleProps>;
  description?: Passthrough<ToastDescriptionProps>;
  close?: Passthrough<ToastCloseProps>;
  closeIcon?: Passthrough<IconProps>;
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

export type ToastRecipe = Recipe<ToastProps, ToastEmits>;
