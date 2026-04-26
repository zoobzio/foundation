import type { Table } from "./data-table";

export type DataTableSearchPassthrough = {
  popover?: Passthrough<PopoverProps, PopoverEmits>;
  trigger?: Passthrough<FabProps>;
  wrap?: Passthrough<GroupProps>;
  input?: Passthrough<InputProps>;
};

export type DataTableSearchProps<T, K = unknown> = {
  table: Table<T, K>;
  pt?: DataTableSearchPassthrough;
};
