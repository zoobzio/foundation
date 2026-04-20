import type { PageCollections } from "@nuxt/content";

export type ContentTreePassthrough = {};

export type ContentTreeProps = {
  collection: keyof PageCollections;
  /** Version prefix to scope navigation (e.g. "v1.0.0") */
  versionPrefix?: string;
  title?: string;
  icon?: IconAlias;
  pt?: ContentTreePassthrough;
};

export type ContentTreeEmits = {};

export const defineContentTree = useComponentRecipe<ContentTreeProps, ContentTreeEmits>();

export type ContentTreeRecipe = ComponentRecipe<ContentTreeProps, ContentTreeEmits>;
