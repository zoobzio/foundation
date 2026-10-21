import type { HeroDefinition } from "../types/components/hero";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a hero definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineHero(definition: HeroDefinition): HeroDefinition;
export function defineHero(
  definition: DefinitionSource<HeroDefinition>,
): ComputedRef<HeroDefinition>;
export function defineHero(
  definition: HeroDefinition | DefinitionSource<HeroDefinition>,
): HeroDefinition | ComputedRef<HeroDefinition> {
  return define(definition);
}
