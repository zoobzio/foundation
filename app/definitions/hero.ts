import type { HeroEmits, HeroProps } from "#foundation/types/core/hero";
import type { Definition } from "#foundation/types/definition";

/**
 * A hero instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type HeroDefinition = Definition<
  HeroProps,
  HeroEmits
>;

/**
 * Declares a hero at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineHero = (
  definition: HeroDefinition,
): HeroDefinition => definition;
