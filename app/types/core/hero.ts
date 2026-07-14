import type { ButtonProps } from "#foundation/types/common/button";
import type { EmProps } from "#foundation/types/common/em";
import type { GroupProps } from "#foundation/types/common/group";
import type { H1Props } from "#foundation/types/common/h1";
import type { PProps } from "#foundation/types/common/p";
import type { SectionProps } from "#foundation/types/common/section";
import type { Link } from "#foundation/types/core/common";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Recipe } from "#foundation/types/core/recipe";
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
