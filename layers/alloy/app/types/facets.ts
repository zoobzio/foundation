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
  selected?: Set<string>;
  groups: FacetGroup[];
  pt?: FacetsPassthrough;
};

export type FacetsEmits = {
  "update:selected": [value: Set<string>];
};

export type FacetsRecipe = Recipe<FacetsProps, FacetsEmits>;
