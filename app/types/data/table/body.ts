import type { AnchorProps } from "../../common/anchor";
import type { ImgProps } from "../../common/img";
import type { SpanProps } from "../../common/span";
import type { TbodyProps } from "../../common/tbody";
import type { TdProps } from "../../common/td";
import type { TrProps } from "../../common/tr";
import type {
  CheckboxEmits,
  CheckboxProps,
} from "../../core/checkbox";
import type { FabProps } from "../../core/fab";
import type { MenuEmits, MenuProps } from "../../core/menu";
import type { Passthrough, PT } from "../../passthrough";
import type { DataTableColumn, Service } from "../table";
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

export type TableBodyProps<T> = {
  table: Service<T>;
  pt?: PT<TableBodyPassthrough>;
};

export type TableBodyContext<T> = {
  table: Service<T>;
  el: ComponentPublicInstance | null;
  settings: TableBodyPassthrough;
};

export type TableCellContext<T> = TableBodyContext<T> & {
  row: T;
  column: DataTableColumn<T>;
  value: unknown;
};

/**
 * Cell overrides cascade: a specific `cell:<key>`, then `cell:<type>`, then the
 * catch-all `cell`. The keyed/typed variants share the template-literal slot.
 */
export type TableBodySlots<T> = {
  empty?: (props: TableBodyContext<T>) => VNode[];
  cell?: (props: TableCellContext<T>) => VNode[];
} & {
  [name: `cell:${string}`]:
    | ((props: TableCellContext<T>) => VNode[])
    | undefined;
};
