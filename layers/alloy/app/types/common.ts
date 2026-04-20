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
 * Table of contents link with depth for indentation
 */
export interface TocLink extends Hierarchy<TocLink> {
  id: string;
  text: string;
  depth: number;
}

/**
 * Keyboard shortcut string (e.g., "meta+k", "ctrl+shift+p")
 */
export type ButtonShortcut = string;
