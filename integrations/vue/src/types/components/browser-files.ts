import type { CheckboxEmits, CheckboxProps } from "./checkbox";
import type { FabProps } from "./fab";
import type { MenuEmits, MenuItem, MenuProps } from "./menu";
import type { LinkProps } from "../common";
import type { PT, PassthroughIter, Rendered } from "../passthrough";
import type { BrowserColumn, Service } from "@zoobzio/browser";
import type { VNode } from "vue";

/**
 * A file or folder action as a menu item: the config key the service
 * dispatches by, plus the label.
 */
export interface BrowserActionItem extends MenuItem {
  key: string;
}

/**
 * One file cell: the row, the column, and the cell value.
 */
export type BrowserFileCell<T> = {
  row: T;
  column: BrowserColumn<T>;
  value: unknown;
};

/**
 * The parts of the file rows that accept passthrough. `link` is the
 * anchor of a `url` cell, built per cell.
 */
export type BrowserFilesPassthrough<T> = {
  rowCheckbox: Rendered<CheckboxProps, CheckboxEmits>;
  actionsMenu: Rendered<
    MenuProps<BrowserActionItem>,
    MenuEmits<BrowserActionItem>
  >;
  actionsTrigger: Rendered<FabProps>;
  link: PassthroughIter<BrowserFileCell<T>, LinkProps>;
};

/**
 * Props of the file rows: the headless service plus passthrough.
 */
export type BrowserFilesProps<T> = {
  service: Service<T>;
  pt?: PT<BrowserFilesPassthrough<T>>;
};

/**
 * The file rows view model, served to `defineExpose` and the slots.
 */
export type BrowserFilesContext<T> = {
  browser: Service<T>;
  el: HTMLTableSectionElement | null;
  settings: BrowserFilesPassthrough<T>;
};

/**
 * The payload of a cell slot: the files context plus the cell.
 */
export type BrowserFileCellContext<T> = BrowserFilesContext<T> &
  BrowserFileCell<T>;

/**
 * Slots of the file rows. Cell overrides cascade: `cell:<key>` for one
 * column, then `cell:<type>` for all columns of a type, then `cell` for
 * every cell. `noFiles` is the empty file section, distinct from the
 * browser's `empty` slot, which replaces the whole body when the folder
 * has neither folders nor files.
 */
export type BrowserFilesSlots<T> = {
  noFiles?: (props: BrowserFilesContext<T>) => VNode[];
  cell?: (props: BrowserFileCellContext<T>) => VNode[];
} & {
  [name: `cell:${string}`]:
    | ((props: BrowserFileCellContext<T>) => VNode[])
    | undefined;
  actionsPrepend?: (props: BrowserFilesContext<T> & { row: T }) => VNode[];
  actionsAppend?: (props: BrowserFilesContext<T> & { row: T }) => VNode[];
  actionPrepend?: (
    props: BrowserFilesContext<T> & { row: T; item: BrowserActionItem },
  ) => VNode[];
  actionAppend?: (
    props: BrowserFilesContext<T> & { row: T; item: BrowserActionItem },
  ) => VNode[];
};
