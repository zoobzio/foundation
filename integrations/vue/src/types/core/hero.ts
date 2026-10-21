import type { Link } from "../common";
import type { Definition } from "../definition";
import type { VNode } from "vue";

/**
 * Props of the hero.
 */
export type HeroProps = {
  tagline: string;
  taglineHighlight?: string;
  description?: string;
  action?: Link;
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
};

/**
 * Slots of the hero. Each slot receives the context.
 */
export type HeroSlots = {
  content?: (props: HeroContext) => VNode[];
  tagline?: (props: HeroContext) => VNode[];
  taglineHighlight?: (props: HeroContext) => VNode[];
  description?: (props: HeroContext) => VNode[];
  button?: (props: HeroContext) => VNode[];
  showcase?: (props: HeroContext) => VNode[];
};

/**
 * A hero instance as data: props plus emit listeners.
 */
export type HeroDefinition = Definition<HeroProps, HeroEmits>;
