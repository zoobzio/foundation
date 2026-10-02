/**
 * Base type for selectable items (tabs, listbox, select, accordion)
 */
export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Base type for navigation links
 */
export interface Link {
  label: string;
  to: string;
  description?: string;
  external?: boolean;
  target?: "_blank" | "_self";
  replace?: boolean;
  prefetch?: boolean;
  disabled?: boolean;
}

/**
 * The navigation half of a Link: what an item carries in its `link` field to
 * render as a real hyperlink through NuxtLink instead of an emit-only control
 */
export type LinkTarget = Pick<
  Link,
  "to" | "external" | "target" | "replace" | "prefetch"
>;

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
