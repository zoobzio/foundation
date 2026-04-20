export type ContentFiltersPassthrough = {};

export type ContentFiltersProps = {
  collection: string;
  pt?: ContentFiltersPassthrough;
};

export type ContentFiltersEmits = {};

export const defineContentFilters = useComponentRecipe<ContentFiltersProps, ContentFiltersEmits>();

export type ContentFiltersRecipe = ComponentRecipe<ContentFiltersProps, ContentFiltersEmits>;
