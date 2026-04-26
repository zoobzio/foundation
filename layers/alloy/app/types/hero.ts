export type HeroPassthrough = {
  root?: Passthrough<SectionProps>;
  content?: Passthrough<GroupProps>;
  tagline?: Passthrough<H1Props>;
  taglineHighlight?: Passthrough<EmProps>;
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

export type HeroRecipe = Recipe<HeroProps, HeroEmits>;
