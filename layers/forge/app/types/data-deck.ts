/**
 * Date field config — available sort fields for the deck.
 */
export interface DateFieldConfig<T> {
  key: keyof T;
  label: string;
}

/**
 * Parameters passed to the deck fetch function.
 * Cursor-based: use `after` for polling, `before` for load-more, neither for initial.
 */
export interface DataDeckFetchParams {
  limit: number;
  sortField: string;
  after?: string;
  before?: string;
  query: string;
  keywords: string;
  match: MatchMode;
  facets: Set<string>;
}

/**
 * Result returned from the deck fetch function.
 */
export interface DataDeckFetchResult<T> {
  data: T[];
  hasMore: boolean;
  facets?: FacetGroup[];
}

/**
 * Writable slice of deck state for snapshots.
 */
export interface DataDeckPayload {
  sortField: string;
  query: string;
  keywords: string;
  match: MatchMode;
  selectedFacets: Set<string>;
}

/**
 * Config the consumer provides to the factory.
 */
export interface DataDeckConfig<T> {
  topic: string;
  rowKey: keyof T;
  dateFields: DateFieldConfig<T>[];
  pollInterval?: number;
  pageSize?: number;
  fetch: (params: DataDeckFetchParams) => Promise<DataDeckFetchResult<T>>;
}

/**
 * The reactive interface for a data deck.
 * Returned by the deck factory. Components accept this as their prop.
 */
export interface Deck<T> {
  // Reactive state
  items: Ref<T[]>;
  pending: Ref<T[]>;
  loading: Ref<boolean>;
  loadingMore: Ref<boolean>;
  hasMore: Ref<boolean>;
  initialized: Ref<boolean>;

  // Filter state
  query: Ref<string>;
  keywords: Ref<string>;
  match: Ref<MatchMode>;
  selectedFacets: Ref<Set<string>>;
  facetGroups: Ref<FacetGroup[]>;

  // Sort
  sortField: Ref<string>;

  // Static config
  readonly topic: string;
  readonly rowKey: keyof T;
  readonly dateFields: DateFieldConfig<T>[];
  readonly pollInterval: number;

  // Getters
  title: ComputedRef<string>;
  pendingCount: ComputedRef<number>;

  // Actions
  init: () => Promise<boolean>;
  fetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  showPending: () => void;
  setSortField: (field: string) => void;
  startPolling: () => void;
  stopPolling: () => void;
  getSnapshot: () => DataDeckSnapshot;
  restoreSnapshot: (snapshot: DataDeckSnapshot) => void;
}
