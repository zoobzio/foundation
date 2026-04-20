import type { PageCollections, ContentCollectionItem } from "@nuxt/content";

export type ContentGridItem = ContentCollectionItem & {
  author?: string;
  published?: string;
};

export type ContentGridPassthrough = {};

export type ContentGridProps = {
  collection: keyof PageCollections;
  pt?: ContentGridPassthrough;
};

export type ContentGridEmits = {};

export const defineContentGrid = useComponentRecipe<ContentGridProps, ContentGridEmits>();

export type ContentGridRecipe = ComponentRecipe<ContentGridProps, ContentGridEmits>;
