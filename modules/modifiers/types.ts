import type components from "#config/components";

/** A component that is allowed to have modifiers defined for it. */
export type SupportedComponent = (typeof components.elements)[number];

/** A single modifier axis — the set of values a knob may take. */
export type ModifierAxis = readonly string[];

/** The modifier axes defined for one component, keyed by axis name. */
export type ModifierAxes = Record<string, ModifierAxis>;

/**
 * The user-authored modifier schema.
 *
 * Keys are constrained to {@link SupportedComponent}, so consumers only see —
 * and can only configure — components that actually support modifiers.
 */
export type ModifiersInput = Partial<Record<SupportedComponent, ModifierAxes>>;
