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
 * Data table column definition
 */
export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  sortKey?: string;
}

/**
 * Sort direction for table columns
 */
export type SortDirection = "asc" | "desc";

/**
 * Pagination store interface
 * Subset of TableStore for components that only need pagination.
 * Uses page/pageSize for UI convenience; stores translate to from/size for the API.
 */
export interface PaginationStore {
  page: Ref<number>;
  pageSize: Ref<number>;
  pageCount: ComputedRef<number>;
  total: Ref<number>;
  hasMore: Ref<boolean>;
  goToPage: (page: number) => void;
}

/**
 * Match mode for combining query and keywords
 */
export type MatchMode = "all" | "any";

/**
 * Table store interface for managing table state.
 * Aligned to the search API shape: query + keywords + facets + sort.
 */
export interface TableStore<T> extends PaginationStore {
  // Data
  data: Ref<T[]>;
  loading: Ref<boolean>;

  // Sorting
  sortField: Ref<string | null>;
  sortDirection: Ref<SortDirection>;
  sort: (field: string) => void;

  // Search
  query: Ref<string>;
  keywords: Ref<string>;
  match: Ref<MatchMode>;

  // Facets
  facets: Ref<Record<string, unknown>>;
  clearFacets: () => void;
}

/**
 * Action available when items are selected
 */
export interface SelectionAction<K = unknown> {
  icon: IconAlias;
  label: string;
  action: (selected: Set<K>) => void;
}

/**
 * Facet item with count
 */
export interface FacetItem {
  value: string;
  label: string;
  count: number;
}

/**
 * Facet group
 */
export interface FacetGroup {
  key: string;
  label: string;
  items: FacetItem[];
}

/**
 * Faceting mixin for table stores
 */
export interface FacetableStore {
  facets: ComputedRef<FacetGroup[]>;
  selectedFacets: Ref<Set<string>>;
}

/**
 * Selection mixin for table stores
 * Stores can implement this to support row selection
 */
export interface SelectableStore<K = unknown> {
  selected: Ref<Set<K>>;
  isAllSelected: ComputedRef<boolean>;
  isIndeterminate: ComputedRef<boolean>;
  selectionActions: SelectionAction<K>[];
  toggleRow: (key: K) => void;
  toggleAll: () => void;
  clearSelection: () => void;
}

/**
 * Keyboard shortcut string (e.g., "meta+k", "ctrl+shift+p")
 */
export type ButtonShortcut = string;

/**
 * Date filter operator types
 */
export type DateFilterOperator = "before" | "after" | "between";

/**
 * Date filter definition
 */
export interface DateFilter {
  field: string;
  operator: DateFilterOperator;
  value: Date;
  endValue?: Date;
}

/**
 * Date field configuration
 */
export interface DateFieldConfig {
  key: string;
  label: string;
}

/**
 * Date filtering mixin for table stores
 */
export interface DateFilterableStore {
  dateFields: DateFieldConfig[];
  dateFilters: Ref<DateFilter[]>;
  addDateFilter: (filter: DateFilter) => void;
  removeDateFilter: (field: string) => void;
  clearDateFilters: () => void;
}
