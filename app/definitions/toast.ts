import type { ToastEmits, ToastProps } from "../types/core/toast";
import type { Definition } from "../types/definition";

/**
 * A toast instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type ToastDefinition = Definition<
  ToastProps,
  ToastEmits
>;

/**
 * Declares a toast at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineToast = (
  definition: ToastDefinition,
): ToastDefinition => definition;
