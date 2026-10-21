import type { AccordionDefinition } from "../types/components/accordion";
import type { Option } from "../types/common";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates an accordion definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
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
