import type { Table } from "./data-table";

export type DataTableHeadPassthrough = {
  thead?: Passthrough<TheadProps>;
  theadTr?: Passthrough<TrProps>;
  th?: Passthrough<ThProps>;
  selectAllCheckbox?: Passthrough<CheckboxProps, CheckboxEmits>;
  headerWrap?: Passthrough<GroupProps>;
  sortButton?: Passthrough<ButtonProps>;
  sortIcon?: Passthrough<IconProps>;
  headerLabel?: Passthrough<SpanProps>;
  dragIcon?: Passthrough<IconProps>;
};

export type DataTableHeadProps<T, K = unknown> = {
  table: Table<T, K>;
  pt?: DataTableHeadPassthrough;
};
