/**
 * Base type for selectable items (tabs, listbox, select, accordion)
 */
export interface Option {
  value: string;
  label: string;
  icon?: IconAlias;
  disabled?: boolean;
}

/**
 * Base type for navigation links
 */
export interface Link {
  label: string;
  to: string;
  icon?: IconAlias;
  description?: string;
  external?: boolean;
  target?: "_blank" | "_self";
  replace?: boolean;
  prefetch?: boolean;
  disabled?: boolean;
}

/**
 * Mixin for hierarchical structures with children
 */
export interface Hierarchy<T> {
  children?: T[];
}

/**
 * Tree node - hierarchical item with optional link
 */
export interface TreeNode extends Hierarchy<TreeNode> {
  value: string;
  label: string;
  icon?: IconAlias;
  to?: string;
  disabled?: boolean;
}

/**
 * Navigator menu item - expands to show child items
 */
export interface NavigatorMenu extends Hierarchy<NavigatorItem> {
  label: string;
  value: string;
  icon?: IconAlias;
  children: NavigatorItem[];
}

/**
 * Navigator item - either a direct link or an expandable menu
 */
export type NavigatorItem = Link | NavigatorMenu;

/**
 * Table of contents link with depth for indentation
 */
export interface TocLink extends Hierarchy<TocLink> {
  id: string;
  text: string;
  depth: number;
}

/**
 * Data table column definition
 */
export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
}

/**
 * Button keyboard shortcut keys
 */
export type ButtonShortcut = "k" | "l" | "t" | "d";
