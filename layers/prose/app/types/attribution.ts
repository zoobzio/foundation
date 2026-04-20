export type AttributionPassthrough = {};

export type AttributionProps = {
  author?: string;
  published?: string;
  updated?: string;
  readtime?: string;
  editUrl?: string;
  share?: boolean;
  shareTitle?: string;
  pt?: AttributionPassthrough;
};

export type AttributionEmits = {};

export const defineAttribution = useComponentRecipe<AttributionProps, AttributionEmits>();

export type AttributionRecipe = ComponentRecipe<AttributionProps, AttributionEmits>;
