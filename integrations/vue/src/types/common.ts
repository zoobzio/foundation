/**
 * An item a component can select.
 */
export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * A navigation link.
 */
export interface Link {
  label: string;
  to: string;
  description?: string;
  target?: "_blank" | "_self";
  disabled?: boolean;
}

/**
 * The navigation fields of a Link. An item with a `link` renders as an anchor.
 */
export type LinkTarget = Pick<Link, "to" | "target">;

/**
 * Adds optional children to a node type.
 */
export interface Hierarchy<T> {
  children?: T[];
}

/**
 * A table-of-contents entry. `depth` sets the indentation.
 */
export interface TocLink extends Hierarchy<TocLink> {
  id: string;
  text: string;
  depth: number;
}

/**
 * A keyboard shortcut string, for example `meta+k`.
 */
export type ButtonShortcut = string;
