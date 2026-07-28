import type { ModifierAxesOptions } from "#foundation/types/modifiers";

export interface Notification {
  id: `${string}${string}-${string}-${string}-${string}`;
  variant: ModifierAxesOptions<"toast-root", "variant">;
  title: string;
  description?: string;
}
