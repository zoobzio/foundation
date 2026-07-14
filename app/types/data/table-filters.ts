import type { ChipProps } from "#foundation/types/common/chip";
import type { GroupProps } from "#foundation/types/common/group";
import type { IconProps } from "#foundation/types/common/icon";
import type { AutocompletePassthrough } from "#foundation/types/core/autocomplete";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Table } from "#foundation/types/data/table";
import type { DataTableFilterHelpPassthrough } from "#foundation/types/data/table-filter-help";

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
