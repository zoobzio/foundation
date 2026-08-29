import type {
  AutocompleteEmits,
  AutocompleteProps,
} from "../types/core/autocomplete";
import type { Definition } from "../types/definition";

/**
 * An autocomplete instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type AutocompleteDefinition<M = unknown> = Definition<
  AutocompleteProps<M>,
  AutocompleteEmits<M>
>;

/**
 * Declares an autocomplete at module scope — pure data, no runtime, no Vue.
 * The identity function is the type checkpoint: every field errors on the
 * line it is written.
 */
export const defineAutocomplete = <M = unknown>(
  definition: AutocompleteDefinition<M>,
): AutocompleteDefinition<M> => definition;
