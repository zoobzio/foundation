import type {
  CheckboxEmits,
  CheckboxProps,
} from "../../core/checkbox";
import type { FabProps } from "../../core/fab";
import type { MenuEmits, MenuProps } from "../../core/menu";
import type { Passthrough, PT } from "../../passthrough";
import type { DataTableColumn, Service } from "../table";
import type { VNode } from "vue";

export type TableBodyPassthrough = {
  rowCheckbox: Passthrough<CheckboxProps, CheckboxEmits>;
  actionsMenu: Passthrough<MenuProps, MenuEmits>;
  actionsTrigger: Passthrough<FabProps>;
};

export type TableBodyProps<T> = {
  table: Service<T>;
  pt?: PT<TableBodyPassthrough>;
};

export type TableBodyContext<T> = {
  table: Service<T>;
  el: HTMLTableSectionElement | null;
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
