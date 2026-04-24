export type HeroPassthrough = {
  root?: Passthrough<SectionProps>;
  content?: Passthrough<GroupProps>;
  tagline?: Passthrough<H1Props>;
  description?: Passthrough<PProps>;
  button?: Passthrough<ButtonProps>;
  showcase?: Passthrough<GroupProps>;
};

export type HeroProps = {
  tagline: string;
  taglineHighlight?: string;
  description?: string;
  action?: Link;
  pt?: HeroPassthrough;
};

export type HeroEmits = {};

export const defineHero = defineComponentRecipe<HeroProps, HeroEmits>();

export type HeroRecipe = Recipe<HeroProps, HeroEmits>;
