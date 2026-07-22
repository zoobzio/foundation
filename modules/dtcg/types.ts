import type components from "#config/components";
import type { Token } from "#foundation/types/tokens";

/** A component that may declare component tokens. */
export type SupportedComponent = (typeof components.elements)[number];

/** A component's token slots — each token name mapped to its default theme token. */
export type ComponentTokenSlots = Record<string, Token>;

/**
 * The user-authored component-token schema.
 *
 * Keys are constrained to {@link SupportedComponent}; each slot's default is
 * checked against the theme's {@link Token}s, so authoring gets autocomplete for
 * both the component and its default token.
 */
export type ComponentTokensInput = Partial<
  Record<SupportedComponent, ComponentTokenSlots>
>;
