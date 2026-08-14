import type { DialogEmits, DialogProps } from "#foundation/types/core/dialog";
import type { Definition } from "#foundation/types/definition";

/**
 * A dialog instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type DialogDefinition = Definition<
  DialogProps,
  DialogEmits
>;

/**
 * Declares a dialog at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineDialog = (
  definition: DialogDefinition,
): DialogDefinition => definition;
