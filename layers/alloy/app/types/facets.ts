export type FacetItem = {
  value: string;
  label: string;
  count: number;
};

export type FacetGroup = {
  key: string;
  label: string;
  items: FacetItem[];
};

export type FacetsPassthrough = {
  root?: Passthrough<GroupProps>;
};

export type FacetsProps = {
  groups: FacetGroup[];
  pt?: FacetsPassthrough;
};

export type FacetsEmits = {};

export const defineFacets = defineComponentRecipe<FacetsProps, FacetsEmits>();

export type FacetsRecipe = Recipe<FacetsProps, FacetsEmits>;
