import type { Table } from "./data-table";

export type DataTableBodyPassthrough = {
  tbody?: Passthrough<TbodyProps>;
  tr?: Passthrough<TrProps>;
  td?: Passthrough<TdProps>;
  empty?: Passthrough<TdProps>;
  rowCheckbox?: Passthrough<CheckboxProps, CheckboxEmits>;
  cellAnchor?: Passthrough<AnchorProps>;
  cellImg?: Passthrough<ImgProps>;
  cellSpan?: Passthrough<SpanProps>;
  actionsMenu?: Passthrough<MenuProps, MenuEmits>;
  actionsTrigger?: Passthrough<FabProps>;
};

export type DataTableBodyProps<T, K = unknown> = {
  table: Table<T, K>;
  pt?: DataTableBodyPassthrough;
};
