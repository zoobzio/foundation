export type PaginationPassthrough = {
  root?: Passthrough<GroupProps>;
  info?: Passthrough<SpanProps>;
  pages?: Passthrough<GroupProps>;
  first?: Passthrough<FabProps>;
  prev?: Passthrough<FabProps>;
  next?: Passthrough<FabProps>;
  last?: Passthrough<FabProps>;
  numbers?: Passthrough<GroupProps>;
  number?: Passthrough<ButtonProps>;
  pageSize?: Passthrough<SelectProps, SelectEmits>;
};

export type PaginationProps = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
  goToPage: (page: number) => void;
  pt?: PaginationPassthrough;
};

export type PaginationEmits = {
  "update:pageSize": [value: number];
};

export type PaginationRecipe = Recipe<PaginationProps, PaginationEmits>;
