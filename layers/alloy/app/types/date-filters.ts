export type DateFilterOperator = "before" | "after" | "between";

export type DateFilter = {
  field: string;
  operator: DateFilterOperator;
  value: Date;
  endValue?: Date;
};

export type DateFieldConfig = {
  key: string;
  label: string;
};

export type DateFiltersPassthrough = {
  root?: Passthrough<GroupProps>;
};

export type DateFiltersProps = {
  fields: DateFieldConfig[];
  addFilter: (filter: DateFilter) => void;
  removeFilter: (field: string) => void;
  pt?: DateFiltersPassthrough;
};

export type DateFiltersEmits = {};

export const defineDateFilters = useComponentRecipe<DateFiltersProps, DateFiltersEmits>();

export type DateFiltersRecipe = ComponentRecipe<DateFiltersProps, DateFiltersEmits>;
