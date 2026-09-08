import type { CheckboxEmits, CheckboxProps } from "../../core/checkbox";
import type { FabProps } from "../../core/fab";
import type { MenuEmits, MenuProps } from "../../core/menu";
import type { Passthrough, PT } from "../../passthrough";
import type { Service } from "../browser";
import type { DataTableColumn } from "../table";
import type { VNode } from "vue";

export type BrowserFilesPassthrough = {
  rowCheckbox: Passthrough<CheckboxProps, CheckboxEmits>;
  actionsMenu: Passthrough<MenuProps, MenuEmits>;
  actionsTrigger: Passthrough<FabProps>;
};

export type BrowserFilesProps<T> = {
  browser: Service<T>;
  pt?: PT<BrowserFilesPassthrough>;
};

export type BrowserFilesContext<T> = {
  browser: Service<T>;
  el: HTMLTableSectionElement | null;
  settings: BrowserFilesPassthrough;
};

export type BrowserFileCellContext<T> = BrowserFilesContext<T> & {
  row: T;
  column: DataTableColumn<T>;
  value: unknown;
};

/**
 * Cell overrides cascade: a specific `cell:<key>`, then `cell:<type>`, then
 * the catch-all `cell`. The keyed/typed variants share the template-literal
 * slot. `noFiles` is the empty file-rows section — distinct from the
 * widget's `empty` slot, which replaces the whole browser body when the
 * folder has neither folders nor files.
 */
export type BrowserFilesSlots<T> = {
  noFiles?: (props: BrowserFilesContext<T>) => VNode[];
  cell?: (props: BrowserFileCellContext<T>) => VNode[];
} & {
  [name: `cell:${string}`]:
    | ((props: BrowserFileCellContext<T>) => VNode[])
    | undefined;
};
