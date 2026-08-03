import type { AnchorProps } from "#foundation/types/common/anchor";
import type { ImgProps } from "#foundation/types/common/img";
import type { SpanProps } from "#foundation/types/common/span";
import type { TbodyProps } from "#foundation/types/common/tbody";
import type { TdProps } from "#foundation/types/common/td";
import type { TrProps } from "#foundation/types/common/tr";
import type {
  CheckboxEmits,
  CheckboxProps,
} from "#foundation/types/core/checkbox";
import type { FabProps } from "#foundation/types/core/fab";
import type { MenuEmits, MenuProps } from "#foundation/types/core/menu";
import type { Passthrough, PT } from "#foundation/types/passthrough";
import type { DataTableColumn, Service } from "#foundation/types/data/table";
import type { ComponentPublicInstance, VNode } from "vue";

export type TableBodyPassthrough = {
  tbody: Passthrough<TbodyProps>;
  tr: Passthrough<TrProps>;
  td: Passthrough<TdProps>;
  empty: Passthrough<TdProps>;
  rowCheckbox: Passthrough<CheckboxProps, CheckboxEmits>;
  cellAnchor: Passthrough<AnchorProps>;
  // `src` comes from row data, bound by the template.
  cellImg: Passthrough<Omit<ImgProps, "src">>;
  cellSpan: Passthrough<SpanProps>;
  actionsMenu: Passthrough<MenuProps, MenuEmits>;
  actionsTrigger: Passthrough<FabProps>;
};

export type TableBodyProps<T, K = unknown> = {
  table: Service<T, K>;
  pt?: PT<TableBodyPassthrough>;
};

export type TableBodyContext<T, K = unknown> = {
  table: Service<T, K>;
  el: ComponentPublicInstance | null;
  settings: TableBodyPassthrough;
};

export type TableCellContext<T, K = unknown> = TableBodyContext<T, K> & {
  row: T;
  column: DataTableColumn<T>;
  value: unknown;
};

/**
 * Cell overrides cascade: a specific `cell:<key>`, then `cell:<type>`, then the
 * catch-all `cell`. The keyed/typed variants share the template-literal slot.
 */
export type TableBodySlots<T, K = unknown> = {
  empty?: (props: TableBodyContext<T, K>) => VNode[];
  cell?: (props: TableCellContext<T, K>) => VNode[];
} & {
  [name: `cell:${string}`]:
    | ((props: TableCellContext<T, K>) => VNode[])
    | undefined;
};
