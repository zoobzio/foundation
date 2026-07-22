import type { ComponentTokensInput } from "#modules/dtcg/types";

/**
 * Definition helper for the component-token schema.
 *
 * Wrap your schema for typed authoring — component keys autocomplete to the
 * supported components, and each token's default is checked against the theme's
 * {@link Token}s.
 */
export function defineComponentTokens(
  input: ComponentTokensInput,
): ComponentTokensInput {
  return input;
}
