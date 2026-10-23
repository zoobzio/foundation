import type { Link, LinkProps } from "../common";
import type { Passthrough, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { VNode } from "vue";

/**
 * The parts of the hero that accept passthrough. `link` is the anchor
 * the `action` renders as.
 */
export type HeroPassthrough = {
  link: Passthrough<LinkProps>;
};

/**
 * Props of the hero. `action` is a call to action that navigates.
 */
export type HeroProps = {
  tagline: string;
  taglineHighlight?: string;
  description?: string;
  action?: Link;
  pt?: PT<HeroPassthrough>;
};

/**
 * The hero has no emits.
 */
export type HeroEmits = {};

/**
 * The hero view model, served to `defineExpose` and the slots.
 */
export type HeroContext = {
  tagline: string;
  taglineHighlight?: string;
  description?: string;
  action?: Link;
  el: HTMLElement | null;
  settings: HeroPassthrough;
};

/**
 * Slots of the hero. Each slot receives the context.
 */
export type HeroSlots = {
  content?: (props: HeroContext) => VNode[];
  tagline?: (props: HeroContext) => VNode[];
  taglineHighlight?: (props: HeroContext) => VNode[];
  description?: (props: HeroContext) => VNode[];
  action?: (props: HeroContext) => VNode[];
  showcase?: (props: HeroContext) => VNode[];
};

/**
 * A hero instance as data: props plus emit listeners.
 */
export type HeroDefinition = Definition<HeroProps, HeroEmits>;
