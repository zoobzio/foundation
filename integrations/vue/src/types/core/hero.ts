import type { Link } from "../common";
import type { Definition } from "../definition";
import type { VNode } from "vue";

export type HeroProps = {
  tagline: string;
  taglineHighlight?: string;
  description?: string;
  action?: Link;
};

export type HeroEmits = {};

export type HeroContext = {
  tagline: string;
  taglineHighlight?: string;
  description?: string;
  action?: Link;
  el: HTMLElement | null;
};

export type HeroSlots = {
  content?: (props: HeroContext) => VNode[];
  tagline?: (props: HeroContext) => VNode[];
  taglineHighlight?: (props: HeroContext) => VNode[];
  description?: (props: HeroContext) => VNode[];
  button?: (props: HeroContext) => VNode[];
  showcase?: (props: HeroContext) => VNode[];
};

/**
 * A hero instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type HeroDefinition = Definition<HeroProps, HeroEmits>;
