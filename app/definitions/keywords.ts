import type { KeywordsEmits, KeywordsProps } from "../types/core/keywords";
import type { Definition } from "../types/definition";

/**
 * A keywords instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type KeywordsDefinition = Definition<
  KeywordsProps,
  KeywordsEmits
>;

/**
 * Declares a keywords at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineKeywords = (
  definition: KeywordsDefinition,
): KeywordsDefinition => definition;
