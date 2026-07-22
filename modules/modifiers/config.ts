import type { ModifiersInput } from "#modules/modifiers/types";

/**
 * Definition helper for the modifier schema.
 *
 * Wrap your schema in this to get typed authoring — keys autocomplete to the
 * supported components and each axis is checked against {@link ModifiersInput}.
 */
export function defineModifiers(input: ModifiersInput): ModifiersInput {
  return input;
}
