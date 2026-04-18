export type ToastVariant = "info" | "success" | "warning" | "error";

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

export type ToastEmits = {
  close: [];
};

export const defineToast = useComponentRecipe<ToastProps, ToastEmits>();
