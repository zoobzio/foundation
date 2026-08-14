import type { ButtonProps } from "../common/button";
import type { EmProps } from "../common/em";
import type { GroupProps } from "../common/group";
import type { H1Props } from "../common/h1";
import type { PProps } from "../common/p";
import type { SectionProps } from "../common/section";
import type { Link } from "./common";
import type { Passthrough, PT } from "../passthrough";
import type { ComponentPublicInstance, VNode } from "vue";

export type HeroPassthrough = {
  root: Passthrough<SectionProps>;
  content: Passthrough<GroupProps>;
  tagline: Passthrough<H1Props>;
  taglineHighlight: Passthrough<EmProps>;
  description: Passthrough<PProps>;
  button: Passthrough<ButtonProps>;
  showcase: Passthrough<GroupProps>;
};

export type HeroProps = {
  tagline: string;
  taglineHighlight?: string;
  description?: string;
  action?: Link;
  pt?: PT<HeroPassthrough>;
};

export type HeroEmits = {};

export type HeroContext = {
  tagline: string;
  taglineHighlight?: string;
  description?: string;
  action?: Link;
  el: ComponentPublicInstance | null;
  settings: HeroPassthrough;
};

export type HeroSlots = {
  content?: (props: HeroContext) => VNode[];
  tagline?: (props: HeroContext) => VNode[];
  taglineHighlight?: (props: HeroContext) => VNode[];
  description?: (props: HeroContext) => VNode[];
  button?: (props: HeroContext) => VNode[];
  showcase?: (props: HeroContext) => VNode[];
};
