import type { CheckboxEmits, CheckboxProps } from "./checkbox";
import type { FabProps } from "./fab";
import type { MenuEmits, MenuItem, MenuProps } from "./menu";
import type { LinkProps } from "../common";
import type { PT, PassthroughIter, Rendered } from "../passthrough";
import type { DataTableColumn, Service } from "@zoobzio/table";
import type { VNode } from "vue";

/**
 * A row action as a menu item: the config key the service dispatches by,
 * plus the label.
 */
export interface TableActionItem extends MenuItem {
  key: string;
}

/**
 * One cell: the row, the column, and the cell value.
 */
export type TableCell<T> = {
  row: T;
  column: DataTableColumn<T>;
  value: unknown;
};

/**
 * The parts of the table body that accept passthrough. `link` is the
 * anchor of a `url` cell, built per cell.
 */
export type TableBodyPassthrough<T> = {
  rowCheckbox: Rendered<CheckboxProps, CheckboxEmits>;
  actionsMenu: Rendered<MenuProps<TableActionItem>, MenuEmits<TableActionItem>>;
  actionsTrigger: Rendered<FabProps>;
  link: PassthroughIter<TableCell<T>, LinkProps>;
};

/**
 * Props of the table body: the headless service plus passthrough.
 */
export type TableBodyProps<T> = {
  service: Service<T>;
  pt?: PT<TableBodyPassthrough<T>>;
};

/**
 * The table body view model, served to `defineExpose` and the slots.
 */
export type TableBodyContext<T> = {
  table: Service<T>;
  el: HTMLTableSectionElement | null;
  settings: TableBodyPassthrough<T>;
};

/**
 * The payload of a cell slot: the body context plus the cell.
 */
export type TableCellContext<T> = TableBodyContext<T> & TableCell<T>;

/**
 * Slots of the table body. Cell overrides cascade: `cell:<key>` for one
 * column, then `cell:<type>` for all columns of a type, then `cell` for
 * every cell.
 */
export type TableBodySlots<T> = {
  empty?: (props: TableBodyContext<T>) => VNode[];
  cell?: (props: TableCellContext<T>) => VNode[];
} & {
  [name: `cell:${string}`]:
    | ((props: TableCellContext<T>) => VNode[])
    | undefined;
  actionsPrepend?: (props: TableBodyContext<T> & { row: T }) => VNode[];
  actionsAppend?: (props: TableBodyContext<T> & { row: T }) => VNode[];
  actionPrepend?: (
    props: TableBodyContext<T> & { row: T; item: TableActionItem },
  ) => VNode[];
  actionAppend?: (
    props: TableBodyContext<T> & { row: T; item: TableActionItem },
  ) => VNode[];
};
