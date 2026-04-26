import type { DataTableColumn } from "./data-table";

export type DataTableFilterHelpPassthrough = {
  trigger?: Passthrough<IconProps>;
  dialog?: Passthrough<DialogProps, DialogEmits>;
  table?: Passthrough<TableProps>;
  thead?: Passthrough<TheadProps>;
  tbody?: Passthrough<TbodyProps>;
  th?: Passthrough<ThProps>;
  td?: Passthrough<TdProps>;
  kbd?: Passthrough<KbdProps>;
};

export type DataTableFilterHelpProps<T> = {
  columns: DataTableColumn<T>[];
  pt?: DataTableFilterHelpPassthrough;
};
