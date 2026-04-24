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
  enumValues?: string[];
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
 * Filter value — discriminated by shape.
 */
export type FilterValue =
  | { type: "text"; value: string }
  | { type: "number"; value: number }
  | { type: "number_range"; value: [number, number] }
  | { type: "date"; value: Date }
  | { type: "date_range"; value: [Date, Date] }
  | { type: "enum"; value: string[] }
  | { type: "boolean"; value: boolean };

/**
 * A single filter condition.
 */
export interface TableFilter {
  field: string;
  operator: string;
  value: FilterValue;
}

/**
 * Operators available per column type.
 */
export const filterOperators: Record<string, { value: string; label: string }[]> = {
  text: [
    { value: "contains", label: "contains" },
    { value: "equals", label: "equals" },
    { value: "starts_with", label: "starts with" },
    { value: "ends_with", label: "ends with" },
  ],
  number: [
    { value: "eq", label: "equals" },
    { value: "gt", label: "greater than" },
    { value: "lt", label: "less than" },
    { value: "between", label: "between" },
  ],
  currency: [
    { value: "eq", label: "equals" },
    { value: "gt", label: "greater than" },
    { value: "lt", label: "less than" },
    { value: "between", label: "between" },
  ],
  date: [
    { value: "before", label: "before" },
    { value: "after", label: "after" },
    { value: "between", label: "between" },
  ],
  datetime: [
    { value: "before", label: "before" },
    { value: "after", label: "after" },
    { value: "between", label: "between" },
  ],
  enum: [
    { value: "is", label: "is" },
    { value: "is_not", label: "is not" },
  ],
  boolean: [
    { value: "is_true", label: "is true" },
    { value: "is_false", label: "is false" },
  ],
};

/**
 * Row action — rendered per-row in an actions menu.
 */
export interface RowAction<T> {
  icon: IconAlias;
  label: string;
  action: (row: T) => void;
}

/**
 * Bulk action — rendered when rows are selected.
 */
export interface BulkAction<K> {
  icon: IconAlias;
  label: string;
  action: (selected: Set<K>) => void;
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
export interface DataTableConfig<T, K = unknown> {
  columns: DataTableColumn<T>[];
  rowKey: keyof T;
  fetch: (params: DataTableFetchParams) => Promise<DataTableFetchResult<T>>;
  actions?: RowAction<T>[];
  bulkActions?: BulkAction<K>[];
  pinnedColumns?: (keyof T)[];
  defaultColumnOrder?: (keyof T)[];
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
  bulkActions?: Passthrough<GroupProps>;
  table?: Passthrough<TableProps>;
  thead?: Passthrough<TheadProps>;
  tbody?: Passthrough<TbodyProps>;
  empty?: Passthrough<TdProps>;
  pagination?: Passthrough<GroupProps>;
};

export type DataTableColumnsRecipes = {
  trigger?: FabRecipe;
  checkbox?: CheckboxRecipe;
};

export type DataTableRecipes = {
  keywords: ComputedRef<KeywordsRecipe>;
  facets: ComputedRef<FacetsRecipe>;
  dateFilters: ComputedRef<DateFiltersRecipe>;
  pagination: ComputedRef<PaginationRecipe>;
};

export type DataTableProps<T, K = unknown> = {
  table: Table<T, K>;
  recipes: DataTableRecipes;
  pt?: DataTablePassthrough;
};
