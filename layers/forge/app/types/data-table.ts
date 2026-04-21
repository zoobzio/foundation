/**
 * Column data type — drives rendering, filtering, and sorting behavior.
 */
export type ColumnType =
  | "text"
  | "number"
  | "date"
  | "datetime"
  | "boolean"
  | "enum"
  | "currency"
  | "email"
  | "url"
  | "image"
  | "action";

/**
 * Data table column definition
 */
export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  type?: ColumnType;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  sortKey?: string;
}

/**
 * Sort direction for table columns
 */
export type SortDirection = "asc" | "desc";

/**
 * Match mode for combining query and keywords
 */
export type MatchMode = "all" | "any";

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
 * Row action — rendered per-row in an actions menu.
 */
export interface RowAction<T> {
  icon: IconAlias;
  label: string;
  action: (row: T) => void;
}

/**
 * Injection key for pre-fetched widget configs.
 * Pages provide this. Widgets inject and validate their own slice.
 */
export const WIDGET_CONFIGS: InjectionKey<Record<string, unknown>> =
  Symbol("WIDGET_CONFIGS");

/**
 * The writable slice of table state.
 */
export interface DataTablePayload {
  query: string;
  keywords: string;
  match: MatchMode;
  page: number;
  pageSize: number;
  selectedFacets: Set<string>;
  dateFilters: DateFilter[];
}

/**
 * Config the consumer provides to the factory.
 */
export interface DataTableConfig<T> {
  columns: DataTableColumn<T>[];
  rowKey: keyof T;
  fetch: (params: DataTableFetchParams) => Promise<DataTableFetchResult<T>>;
  actions?: RowAction<T>[];
}

/**
 * Parameters passed to the fetch function
 */
export interface DataTableFetchParams {
  page: number;
  pageSize: number;
  sortField: string | null;
  sortDirection: SortDirection;
  query: string;
  keywords: string;
  match: MatchMode;
  facets: Set<string>;
  dateFilters: DateFilter[];
}

/**
 * Result returned from the fetch function
 */
export interface DataTableFetchResult<T> {
  data: T[];
  total: number;
  pageCount: number;
  facets?: FacetGroup[];
}

export type DataTablePassthrough = {
  root?: Passthrough<GroupProps>;
  toolbar?: Passthrough<GroupProps>;
  table?: Passthrough<TableProps>;
  thead?: Passthrough<TheadProps>;
  tbody?: Passthrough<TbodyProps>;
  empty?: Passthrough<TdProps>;
  pagination?: Passthrough<GroupProps>;
};

export type DataTableRecipes = {
  keywords: ComputedRef<KeywordsRecipe | undefined>;
  facets: ComputedRef<FacetsRecipe | undefined>;
  dateFilters: ComputedRef<DateFiltersRecipe | undefined>;
  pagination: ComputedRef<PaginationRecipe | undefined>;
  selectAll: ComputedRef<CheckboxRecipe | undefined>;
};

export type DataTableProps<T, K = unknown> = {
  table: Table<T, K>;
  recipes?: DataTableRecipes;
  pt?: DataTablePassthrough;
};
