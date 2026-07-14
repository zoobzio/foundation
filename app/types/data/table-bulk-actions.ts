import type { ButtonProps } from "#foundation/types/common/button";
import type { GroupProps } from "#foundation/types/common/group";
import type { IconProps } from "#foundation/types/common/icon";
import type { SpanProps } from "#foundation/types/common/span";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Table } from "#foundation/types/data/table";

export type DataTableBulkActionsPassthrough = {
  root?: Passthrough<GroupProps>;
  count?: Passthrough<SpanProps>;
  action?: Passthrough<ButtonProps>;
  actionIcon?: Passthrough<IconProps>;
  clear?: Passthrough<ButtonProps>;
};

export type DataTableBulkActionsProps<T, K = unknown> = {
  table: Table<T, K>;
  pt?: DataTableBulkActionsPassthrough;
};
