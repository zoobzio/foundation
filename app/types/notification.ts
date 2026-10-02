import type { ToastVariant } from "./core/toast";

export interface Notification {
  id: `${string}${string}-${string}-${string}-${string}`;
  variant: ToastVariant;
  title: string;
  description?: string;
}
