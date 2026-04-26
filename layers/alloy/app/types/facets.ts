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
  popover?: Passthrough<PopoverProps, PopoverEmits>;
  trigger?: Passthrough<FabProps>;
  command?: Passthrough<CommandProps, CommandEmits>;
};

export type FacetsProps = {
  groups: FacetGroup[];
  pt?: FacetsPassthrough;
};

export type FacetsEmits = {};

export type FacetsRecipe = Recipe<FacetsProps, FacetsEmits>;
