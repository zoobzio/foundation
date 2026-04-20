import type { PageCollections, ContentNavigationItem } from "@nuxt/content";

export type ContentTablePassthrough = {};

export type ContentTableProps = {
  /** Collection to query navigation from (only needed at root level) */
  collection?: keyof PageCollections;
  /** Optional version prefix to filter content (e.g., "v1.0.0") */
  versionPrefix?: string;
  /** Pre-resolved nodes for recursive rendering */
  nodes?: ContentNavigationItem[];
  /** Current heading depth -- maps to H3, H4, H5, etc. */
  headingDepth?: number;
  pt?: ContentTablePassthrough;
};

export type ContentTableEmits = {};

export const defineContentTable = useComponentRecipe<ContentTableProps, ContentTableEmits>();

export type ContentTableRecipe = ComponentRecipe<ContentTableProps, ContentTableEmits>;
