import type { GroupProps } from "#foundation/types/common/group";
import type { InputProps } from "#foundation/types/common/input";
import type { FabProps } from "#foundation/types/core/fab";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { PopoverEmits, PopoverProps } from "#foundation/types/core/popover";
import type { Table } from "#foundation/types/data/table";

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
