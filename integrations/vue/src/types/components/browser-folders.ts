import type { BrowserActionItem } from "./browser-files";
import type { FabProps } from "./fab";
import type { MenuEmits, MenuProps } from "./menu";
import type { Passthrough, PT } from "../passthrough";
import type { BrowserFolder, Service } from "@zoobzio/browser";
import type { VNode } from "vue";

/**
 * The parts of the folder rows that accept passthrough.
 */
export type BrowserFoldersPassthrough = {
  actionsMenu: Passthrough<
    MenuProps<BrowserActionItem>,
    MenuEmits<BrowserActionItem>
  >;
  actionsTrigger: Passthrough<FabProps>;
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
 * Slots of the folder rows. Each slot receives the context and its
 * `folder`; the action icon slot also receives its `item`.
 */
export type BrowserFoldersSlots<T> = {
  folder?: (
    props: BrowserFoldersContext<T> & { folder: BrowserFolder },
  ) => VNode[];
  folderIcon?: (
    props: BrowserFoldersContext<T> & { folder: BrowserFolder },
  ) => VNode[];
  folderLabel?: (
    props: BrowserFoldersContext<T> & { folder: BrowserFolder },
  ) => VNode[];
  folderActionsIcon?: (
    props: BrowserFoldersContext<T> & { folder: BrowserFolder },
  ) => VNode[];
  folderActionIcon?: (
    props: BrowserFoldersContext<T> & {
      folder: BrowserFolder;
      item: BrowserActionItem;
    },
  ) => VNode[];
};
