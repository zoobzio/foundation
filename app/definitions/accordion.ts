import type { AccordionEmits, AccordionProps } from "../types/core/accordion";
import type { Option } from "../types/core/common";
import type { Definition } from "../types/definition";

/**
 * A accordion instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type AccordionDefinition<T extends Option = Option> = Definition<
  AccordionProps<T>,
  AccordionEmits
>;

/**
 * Declares a accordion at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineAccordion = <T extends Option>(
  definition: AccordionDefinition<T>,
): AccordionDefinition<T> => definition;
