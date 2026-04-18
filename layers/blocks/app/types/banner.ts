export type BannerProps = {
  icon?: IconAlias;};

export type BannerEmits = {};

export const defineBanner = useComponentRecipe<BannerProps, BannerEmits>();

export type BannerRecipe = ComponentRecipe<BannerProps, BannerEmits>;
