import type { Table } from "./data-table";

export type DataTableColumnsPassthrough = {
  popover?: Passthrough<PopoverProps, PopoverEmits>;
  trigger?: Passthrough<FabProps>;
  command?: Passthrough<CommandProps, CommandEmits>;
};

export type DataTableColumnsProps<T, K = unknown> = {
  table: Table<T, K>;
  pt?: DataTableColumnsPassthrough;
};
