import type { ButtonProps } from "#foundation/types/common/button";
import type { EmProps } from "#foundation/types/common/em";
import type { GroupProps } from "#foundation/types/common/group";
import type { H1Props } from "#foundation/types/common/h1";
import type { PProps } from "#foundation/types/common/p";
import type { SectionProps } from "#foundation/types/common/section";
import type { Link } from "#foundation/types/core/common";
import type { ComponentEvents } from "#foundation/types/events";
import type { Passthrough, PT } from "#foundation/types/passthrough";
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

export type HeroEmits = ComponentEvents["hero"];

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
