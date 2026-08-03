import type components from "#config/components";

export type Element = keyof typeof components.elements;

export type Compound = keyof typeof components.compounds;

export type Component = Element | Compound;
