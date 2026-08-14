import type { CheckboxEmits, CheckboxProps } from "../types/core/checkbox";
import type { Definition } from "../types/definition";

/**
 * A checkbox instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type CheckboxDefinition = Definition<
  CheckboxProps,
  CheckboxEmits
>;

/**
 * Declares a checkbox at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineCheckbox = (
  definition: CheckboxDefinition,
): CheckboxDefinition => definition;
