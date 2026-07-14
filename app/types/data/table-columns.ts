import type { CommandEmits, CommandProps } from "#foundation/types/core/command";
import type { FabProps } from "#foundation/types/core/fab";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { PopoverEmits, PopoverProps } from "#foundation/types/core/popover";
import type { Table } from "#foundation/types/data/table";

export type DataTableColumnsPassthrough = {
  popover?: Passthrough<PopoverProps, PopoverEmits>;
  trigger?: Passthrough<FabProps>;
  command?: Passthrough<CommandProps, CommandEmits>;
};

export type DataTableColumnsProps<T, K = unknown> = {
  table: Table<T, K>;
  pt?: DataTableColumnsPassthrough;
};
