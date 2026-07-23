import type components from "#config/components";

export type Element = (typeof components.elements)[number];

export type Component = Element;
