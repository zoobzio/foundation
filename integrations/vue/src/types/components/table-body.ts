import type { CheckboxEmits, CheckboxProps } from "./checkbox";
import type { FabProps } from "./fab";
import type { MenuEmits, MenuItem, MenuProps } from "./menu";
import type { LinkProps } from "../common";
import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { DataTableColumn, Service } from "@zoobzio/table";
import type { VNode } from "vue";

/**
 * A row action as a menu item: the config key the service dispatches by,
 * plus the label.
 */
export type TableActionItem = MenuItem & { key: string };

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
  rowCheckbox: Passthrough<CheckboxProps, CheckboxEmits>;
  actionsMenu: Passthrough<
    MenuProps<TableActionItem>,
    MenuEmits<TableActionItem>
  >;
  actionsTrigger: Passthrough<FabProps>;
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
  actionsIcon?: (props: TableBodyContext<T> & { row: T }) => VNode[];
  actionIcon?: (
    props: TableBodyContext<T> & { row: T; item: TableActionItem },
  ) => VNode[];
} & {
  [name: `cell:${string}`]:
    | ((props: TableCellContext<T>) => VNode[])
    | undefined;
};
