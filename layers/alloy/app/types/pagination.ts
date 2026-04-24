export type PaginationPassthrough = {
  root?: Passthrough<GroupProps>;
  info?: Passthrough<SpanProps>;
  pages?: Passthrough<GroupProps>;
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

export const definePagination = defineComponentRecipe<PaginationProps, PaginationEmits>();

export type PaginationRecipe = Recipe<PaginationProps, PaginationEmits>;
