import type { AccordionDefinition } from "../types/core/accordion";
import type { Option } from "../types/common";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

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
