import type { banner } from "../../elements.config";

export type BannerProps = {
  icon?: IconAlias;
  tokens?: Tokens<typeof banner.key>;
};

export type BannerEmits = {};

export const defineBanner = useComponentRecipe<BannerProps, BannerEmits>();
