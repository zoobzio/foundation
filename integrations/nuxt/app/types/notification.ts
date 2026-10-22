import type { ToastVariant } from "@zoobzio/vue/types/components/toast";

/**
 * A notification the app shell renders as a toast. `id` is assigned on
 * push, so a consumer never supplies it.
 */
export interface Notification {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
}
