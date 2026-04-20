import type { ContentNavigationItem } from "@nuxt/content";

export type ContentAccordionPassthrough = {};

export type ContentAccordionProps = {
  items: ContentNavigationItem[];
  collection: string;
  pt?: ContentAccordionPassthrough;
};

export type ContentAccordionEmits = {};

export const defineContentAccordion = useComponentRecipe<ContentAccordionProps, ContentAccordionEmits>();

export type ContentAccordionRecipe = ComponentRecipe<ContentAccordionProps, ContentAccordionEmits>;
