import type { Link } from "./common";
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
