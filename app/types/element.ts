import type components from "../../config/components";

/**
 * Component names, derived straight from the registry. This module sits
 * between `config/components.ts` and the prop-type modules (`aria.ts`,
 * `tokens.ts`, `modifiers.ts`) in the type layering, so it must import
 * nothing but the registry — an import from any other `app/types` module
 * would close an import cycle.
 */
export type Element = keyof typeof components.elements;

export type Compound = keyof typeof components.compounds;

export type Component = Element | Compound;
