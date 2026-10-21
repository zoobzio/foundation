import type { HeroDefinition } from "../types/core/hero";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Declares a hero. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
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
