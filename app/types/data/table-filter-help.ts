import type { IconProps } from "#foundation/types/common/icon";
import type { KbdProps } from "#foundation/types/common/kbd";
import type { TableProps } from "#foundation/types/common/table";
import type { TbodyProps } from "#foundation/types/common/tbody";
import type { TdProps } from "#foundation/types/common/td";
import type { ThProps } from "#foundation/types/common/th";
import type { TheadProps } from "#foundation/types/common/thead";
import type { DialogEmits, DialogProps } from "#foundation/types/core/dialog";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { DataTableColumn } from "#foundation/types/data/table";

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
