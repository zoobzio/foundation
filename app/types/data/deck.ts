import type { ComputedRef, Ref } from "#imports";
import type { FacetGroup } from "#foundation/types/core/facets";

/**
 * Match mode for combining query and keywords in a fetch.
 */
export type MatchMode = "all" | "any";

/**
 * Date field config — an available sort field for the deck.
 */
export interface DateFieldConfig<T> {
  key: keyof T;
  label: string;
}

/**
 * Parameters passed to the fetch action. Cursor-based: `after` for polling
 * (newer), `before` for load-more (older), neither for the initial page.
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

export interface DataDeckFetchResult<T> {
  data: T[];
  hasMore: boolean;
  facets?: FacetGroup[];
}

/**
 * Config the consumer provides to the factory — pure data.
 */
export type Config<T> = {
  topic: string;
  rowKey: keyof T;
  dateFields: DateFieldConfig<T>[];
  pollInterval?: number;
  pageSize?: number;
};

export type State<T> = {
  items: Ref<T[]>;
  pending: Ref<T[]>;
  loading: Ref<boolean>;
  loadingMore: Ref<boolean>;
  hasMore: Ref<boolean>;
  initialized: Ref<boolean>;
  query: Ref<string>;
  keywords: Ref<string>;
  match: Ref<MatchMode>;
  selectedFacets: Ref<Set<string>>;
  facetGroups: Ref<FacetGroup[]>;
  sortField: Ref<string>;
};

/**
 * The consumer-supplied fetch mechanism — the deck's single data source.
 */
export type Actions<T> = {
  fetch: (
    params: DataDeckFetchParams,
    service: Service<T>,
  ) => Promise<DataDeckFetchResult<T>>;
};

/**
 * The imperative contract: unwrapped state + derived + the full method surface.
 * `DeckService<T>` declares `implements` against this, and the fetch action
 * receives it.
 */
export type Service<T> = {
  readonly id: string;
  readonly config: Config<T>;
  readonly topic: string;
  readonly rowKey: keyof T;
  readonly dateFields: DateFieldConfig<T>[];
  readonly pollInterval: number;
  readonly pageSize: number;

  readonly items: T[];
  readonly pending: T[];
  readonly loading: boolean;
  readonly loadingMore: boolean;
  readonly hasMore: boolean;
  readonly initialized: boolean;
  readonly query: string;
  readonly keywords: string;
  readonly match: MatchMode;
  readonly selectedFacets: Set<string>;
  readonly facetGroups: FacetGroup[];
  readonly sortField: string;

  readonly title: string;
  readonly pendingCount: number;

  init(): Promise<boolean>;
  fetch(): Promise<void>;
  loadMore(): Promise<void>;
  poll(): Promise<void>;
  showPending(): void;
  setSortField(field: string): void;
  setQuery(query: string): void;
  setKeywords(keywords: string): void;
  setMatch(match: MatchMode): void;
  setFacets(facets: Set<string>): void;
};

export type Events = {
  "deck:updated": (event: { id: string; count: number }) => void;
  "deck:polled": (event: { id: string; count: number }) => void;
};

/**
 * The reactive facade returned by the factory — the widget's prop. Filter state
 * the toolbar edits is exposed as writable computeds routing through the
 * service's mutators; everything else is read-only.
 */
export type Deck<T> = {
  id: string;
  config: Config<T>;

  items: Ref<T[]>;
  pending: Ref<T[]>;
  loading: Ref<boolean>;
  loadingMore: Ref<boolean>;
  hasMore: Ref<boolean>;
  initialized: Ref<boolean>;
  facetGroups: Ref<FacetGroup[]>;

  query: Ref<string>;
  keywords: Ref<string>;
  match: Ref<MatchMode>;
  selectedFacets: Ref<Set<string>>;
  sortField: Ref<string>;

  readonly topic: string;
  readonly rowKey: keyof T;
  readonly dateFields: DateFieldConfig<T>[];
  readonly pollInterval: number;

  title: ComputedRef<string>;
  pendingCount: ComputedRef<number>;

  init: () => Promise<boolean>;
  fetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  poll: () => Promise<void>;
  showPending: () => void;
};
