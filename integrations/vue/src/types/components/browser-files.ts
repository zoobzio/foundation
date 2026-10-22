import type { CheckboxEmits, CheckboxProps } from "./checkbox";
import type { FabProps } from "./fab";
import type { MenuEmits, MenuItem, MenuProps } from "./menu";
import type { Passthrough, PT } from "../passthrough";
import type { BrowserColumn, Service } from "@zoobzio/browser";
import type { VNode } from "vue";

/**
 * A file or folder action as a menu item: the config key the service
 * dispatches by, plus the label.
 */
export type BrowserActionItem = MenuItem & { key: string };

/**
 * The parts of the file rows that accept passthrough.
 */
export type BrowserFilesPassthrough = {
  rowCheckbox: Passthrough<CheckboxProps, CheckboxEmits>;
  actionsMenu: Passthrough<
    MenuProps<BrowserActionItem>,
    MenuEmits<BrowserActionItem>
  >;
  actionsTrigger: Passthrough<FabProps>;
};

/**
 * Props of the file rows: the headless service plus passthrough.
 */
export type BrowserFilesProps<T> = {
  service: Service<T>;
  pt?: PT<BrowserFilesPassthrough>;
};

/**
 * The file rows view model, served to `defineExpose` and the slots.
 */
export type BrowserFilesContext<T> = {
  browser: Service<T>;
  el: HTMLTableSectionElement | null;
  settings: BrowserFilesPassthrough;
};

/**
 * The payload of a cell slot: the files context plus the row, the column,
 * and the cell value.
 */
export type BrowserFileCellContext<T> = BrowserFilesContext<T> & {
  row: T;
  column: BrowserColumn<T>;
  value: unknown;
};

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
  actionsIcon?: (props: BrowserFilesContext<T> & { row: T }) => VNode[];
  actionIcon?: (
    props: BrowserFilesContext<T> & { row: T; item: BrowserActionItem },
  ) => VNode[];
} & {
  [name: `cell:${string}`]:
    | ((props: BrowserFileCellContext<T>) => VNode[])
    | undefined;
};
