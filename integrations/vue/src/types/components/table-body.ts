import type { CheckboxEmits, CheckboxProps } from "./checkbox";
import type { FabProps } from "./fab";
import type { MenuEmits, MenuItem, MenuProps } from "./menu";
import type { LinkProps } from "../common";
import type { PT, PassthroughIter, Rendered } from "../passthrough";
import type {
  RowData,
  Service,
  TableCell,
  TableColumn,
  TableRow,
} from "@zoobzio/table";
import type { VNode } from "vue";

/**
 * A row action as a menu item: the config key the service dispatches by,
 * plus the label.
 */
export interface TableActionItem extends MenuItem {
  key: string;
}

/**
 * One cell, as TanStack Table holds it: the cell, its row (the record is
 * `row.original`), its column, and its value.
 */
export type TableCellScope<T extends RowData> = {
  cell: TableCell<T>;
  row: TableRow<T>;
  column: TableColumn<T>;
  value: unknown;
};

/**
 * The parts of the table body that accept passthrough. `link` is the
 * anchor of a cell, built per cell: the route of a column that names one,
 * wrapping the cell's content, or the value of a `url` cell in a new tab.
 */
export type TableBodyPassthrough<T extends RowData> = {
  rowCheckbox: Rendered<CheckboxProps, CheckboxEmits>;
  actionsMenu: Rendered<MenuProps<TableActionItem>, MenuEmits<TableActionItem>>;
  actionsTrigger: Rendered<FabProps>;
  link: PassthroughIter<TableCellScope<T>, LinkProps>;
};

/**
 * Props of the table body: the headless service plus passthrough.
 */
export type TableBodyProps<T extends RowData> = {
  service: Service<T>;
  pt?: PT<TableBodyPassthrough<T>>;
};

/**
 * The table body view model, served to `defineExpose` and the slots.
 */
export type TableBodyContext<T extends RowData> = {
  table: Service<T>;
  el: HTMLTableSectionElement | null;
  settings: TableBodyPassthrough<T>;
};

/**
 * The payload of a cell slot: the body context plus the cell.
 */
export type TableCellContext<T extends RowData> = TableBodyContext<T> &
  TableCellScope<T>;

/**
 * Slots of the table body. Cell overrides cascade: `cell:<key>` for one
 * column, then `cell:<type>` for all columns of a type, then `cell` for
 * every cell. A `cell:<key>` slot replaces the whole cell; the others
 * render inside the link of a column that names a route.
 */
export type TableBodySlots<T extends RowData> = {
  empty?: (props: TableBodyContext<T>) => VNode[];
  cell?: (props: TableCellContext<T>) => VNode[];
} & {
  [name: `cell:${string}`]:
    | ((props: TableCellContext<T>) => VNode[])
    | undefined;
  actions?: (props: TableBodyContext<T> & { row: TableRow<T> }) => VNode[];
  actionPrepend?: (
    props: TableBodyContext<T> & { row: TableRow<T>; item: TableActionItem },
  ) => VNode[];
  actionAppend?: (
    props: TableBodyContext<T> & { row: TableRow<T>; item: TableActionItem },
  ) => VNode[];
};
