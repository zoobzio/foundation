import type { ToasterEmits, ToasterProps } from "#foundation/types/core/toaster";
import type { Definition } from "#foundation/types/definition";

/**
 * A toaster instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type ToasterDefinition = Definition<
  ToasterProps,
  ToasterEmits
>;

/**
 * Declares a toaster at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineToaster = (
  definition: ToasterDefinition,
): ToasterDefinition => definition;
