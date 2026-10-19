import type { AccordionEmits, AccordionProps } from "../types/core/accordion";
import type { Option } from "../types/core/common";
import type { Definition, DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * A accordion instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type AccordionDefinition<T extends Option = Option> = Definition<
  AccordionProps<T>,
  AccordionEmits
>;

/**
 * Declares a accordion. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
 */
export function defineAccordion<T extends Option>(
  definition: AccordionDefinition<T>,
): AccordionDefinition<T>;
export function defineAccordion<T extends Option>(
  definition: DefinitionSource<AccordionDefinition<T>>,
): ComputedRef<AccordionDefinition<T>>;
export function defineAccordion<T extends Option>(
  definition: AccordionDefinition<T> | DefinitionSource<AccordionDefinition<T>>,
): AccordionDefinition<T> | ComputedRef<AccordionDefinition<T>> {
  return define(definition);
}
