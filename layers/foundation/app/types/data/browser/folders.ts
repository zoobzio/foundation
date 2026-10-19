import type { FabProps } from "../../core/fab";
import type { MenuEmits, MenuItem, MenuProps } from "../../core/menu";
import type { Passthrough, PT } from "../../passthrough";
import type { BrowserFolder, Service } from "../browser";
import type { VNode } from "vue";

export type BrowserFoldersPassthrough = {
  actionsMenu: Passthrough<MenuProps, MenuEmits>;
  actionsTrigger: Passthrough<FabProps>;
};

export type BrowserFoldersProps<T> = {
  browser: Service<T>;
  pt?: PT<BrowserFoldersPassthrough>;
};

export type BrowserFoldersContext<T> = {
  browser: Service<T>;
  el: HTMLTableSectionElement | null;
  settings: BrowserFoldersPassthrough;
};

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
    props: BrowserFoldersContext<T> & { folder: BrowserFolder; item: MenuItem },
  ) => VNode[];
};
