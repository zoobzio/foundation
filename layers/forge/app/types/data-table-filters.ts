import type { Table } from "./data-table";
import type { DataTableFilterHelpPassthrough } from "./data-table-filter-help";

export type DataTableFiltersPassthrough = {
  root?: Passthrough<GroupProps>;
  chips?: Passthrough<GroupProps>;
  icon?: Passthrough<IconProps>;
  chip?: Passthrough<ChipProps>;
  inputWrap?: Passthrough<GroupProps>;
  autocomplete?: AutocompletePassthrough;

  // Sub-component passthrough
  help?: DataTableFilterHelpPassthrough;
};

export type DataTableFiltersProps<T, K = unknown> = {
  table: Table<T, K>;
  pt?: DataTableFiltersPassthrough;
};
