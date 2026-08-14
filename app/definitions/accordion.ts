import type { AccordionEmits, AccordionProps } from "../types/core/accordion";
import type { Definition } from "../types/definition";

/**
 * A accordion instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type AccordionDefinition = Definition<
  AccordionProps,
  AccordionEmits
>;

/**
 * Declares a accordion at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineAccordion = (
  definition: AccordionDefinition,
): AccordionDefinition => definition;
