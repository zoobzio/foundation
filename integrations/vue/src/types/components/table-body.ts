import type { CheckboxEmits, CheckboxProps } from "./checkbox";
import type { FabProps } from "./fab";
import type { MenuEmits, MenuItem, MenuProps } from "./menu";
import type { Passthrough, PT } from "../passthrough";
import type { DataTableColumn, Service } from "@zoobzio/table";
import type { VNode } from "vue";

/**
 * A row action as a menu item: the config key the service dispatches by,
 * plus the label.
 */
export type TableActionItem = MenuItem & { key: string };

/**
 * The parts of the table body that accept passthrough.
 */
export type TableBodyPassthrough = {
  rowCheckbox: Passthrough<CheckboxProps, CheckboxEmits>;
  actionsMenu: Passthrough<
    MenuProps<TableActionItem>,
    MenuEmits<TableActionItem>
  >;
  actionsTrigger: Passthrough<FabProps>;
};

/**
 * Props of the table body: the headless service plus passthrough.
 */
export type TableBodyProps<T> = {
  service: Service<T>;
  pt?: PT<TableBodyPassthrough>;
};

/**
 * The table body view model, served to `defineExpose` and the slots.
 */
export type TableBodyContext<T> = {
  table: Service<T>;
  el: HTMLTableSectionElement | null;
  settings: TableBodyPassthrough;
};

/**
 * The payload of a cell slot: the body context plus the row, the column,
 * and the cell value.
 */
export type TableCellContext<T> = TableBodyContext<T> & {
  row: T;
  column: DataTableColumn<T>;
  value: unknown;
};

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
