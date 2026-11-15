import type { BrowserActionItem } from "./browser-files";
import type { CheckboxEmits, CheckboxProps } from "./checkbox";
import type { FabProps } from "./fab";
import type { MenuEmits, MenuProps } from "./menu";
import type { PT, Rendered } from "../passthrough";
import type { BrowserColumn, BrowserFolder, Service } from "@zoobzio/browser";
import type { VNode } from "vue";

/**
 * One folder cell: the folder, the column, and the value the folder
 * carries for it.
 */
export type BrowserFolderCell<T> = {
  folder: BrowserFolder<T>;
  column: BrowserColumn<T>;
  value: unknown;
};

/**
 * The parts of the folder rows that accept passthrough.
 */
export type BrowserFoldersPassthrough = {
  rowCheckbox: Rendered<CheckboxProps, CheckboxEmits>;
  actionsMenu: Rendered<
    MenuProps<BrowserActionItem>,
    MenuEmits<BrowserActionItem>
  >;
  actionsTrigger: Rendered<FabProps>;
};

/**
 * Props of the folder rows: the headless service plus passthrough.
 */
export type BrowserFoldersProps<T> = {
  service: Service<T>;
  pt?: PT<BrowserFoldersPassthrough>;
};

/**
 * The folder rows view model, served to `defineExpose` and the slots.
 */
export type BrowserFoldersContext<T> = {
  browser: Service<T>;
  el: HTMLTableSectionElement | null;
  settings: BrowserFoldersPassthrough;
};

/**
 * The payload of a folder cell slot: the folders context plus the cell.
 */
export type BrowserFolderCellContext<T> = BrowserFoldersContext<T> &
  BrowserFolderCell<T>;

/**
 * Slots of the folder rows. Each slot receives the context and its
 * `folder`. The `folder` slots fill the cell of the first
 * column; the other columns' cells cascade as a file's do:
 * `folderCell:<key>` for one column, then `folderCell:<type>` for all
 * columns of a type, then `folderCell` for every one.
 */
export type BrowserFoldersSlots<T> = {
  folderCell?: (props: BrowserFolderCellContext<T>) => VNode[];
} & {
  [name: `folderCell:${string}`]:
    | ((props: BrowserFolderCellContext<T>) => VNode[])
    | undefined;
  folder?: (
    props: BrowserFoldersContext<T> & { folder: BrowserFolder<T> },
  ) => VNode[];
  folderLabel?: (
    props: BrowserFoldersContext<T> & { folder: BrowserFolder<T> },
  ) => VNode[];
  folderPrepend?: (
    props: BrowserFoldersContext<T> & { folder: BrowserFolder<T> },
  ) => VNode[];
  folderAppend?: (
    props: BrowserFoldersContext<T> & { folder: BrowserFolder<T> },
  ) => VNode[];
  folderActions?: (
    props: BrowserFoldersContext<T> & { folder: BrowserFolder<T> },
  ) => VNode[];
  folderActionPrepend?: (
    props: BrowserFoldersContext<T> & {
      folder: BrowserFolder<T>;
      item: BrowserActionItem;
    },
  ) => VNode[];
  folderActionAppend?: (
    props: BrowserFoldersContext<T> & {
      folder: BrowserFolder<T>;
      item: BrowserActionItem;
    },
  ) => VNode[];
};
