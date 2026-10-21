import type {
  Change as KitChange,
  Changers as KitChangers,
  Changes as KitChanges,
  Listener as KitListener,
  Middleware as KitMiddleware,
  Options as KitOptions,
} from "@zoobzio/kit";

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
 * A single facet value with its result count.
 */
export type FacetItem = {
  value: string;
  label: string;
  count: number;
};

/**
 * A group of facet values under one key, as a fetch returns them.
 */
export type FacetGroup = {
  key: string;
  label: string;
  items: FacetItem[];
};

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
 * Config the consumer provides — pure serializable data.
 */
export type Config<T> = {
  topic: string;
  rowKey: keyof T;
  dateFields: DateFieldConfig<T>[];
  pollInterval?: number;
  pageSize?: number;
};

/**
 * The state container the service reads and writes: the feed, the pending
 * buffer, the load flags, and the committed search. The container can be a
 * plain object or a reactive proxy. The service replaces each member as a
 * whole, so a proxy tracks every change.
 */
export type State<T> = {
  items: T[];
  pending: T[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  initialized: boolean;
  query: string;
  keywords: string;
  match: MatchMode;
  selectedFacets: Set<string>;
  facetGroups: FacetGroup[];
  sortField: string;
};

export type StateKey = keyof State<unknown>;

/**
 * The kit's state mechanisms bound to this service's container: per-field
 * middleware, the read/write options, and the change objects.
 */
export type Middleware<T> = KitMiddleware<State<T>>;
export type Options<T> = KitOptions<State<T>>;
export type Changes<T> = KitChanges<State<T>>;
export type Change<T, K extends StateKey = StateKey> = KitChange<State<T>, K>;
export type Changers<T> = KitChangers<State<T>>;

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
 * The events of a deck service, keyed by name. Each value is the argument
 * list of a listener. The service emits after the write lands, so a listener
 * reads the new state.
 *
 * - `change`: any field of the container was written.
 * - `updated`: a fetch settled, success or failure. `count` is the feed length.
 * - `polled`: a poll found newer items. `count` is the number found.
 * - `failed`: a poll threw. The error is not rethrown, so the caller's
 *   interval survives; `cause` carries it.
 */
export type Events<T> = {
  change: [change: Change<T>];
  updated: [event: { id: string; count: number }];
  polled: [event: { id: string; count: number }];
  failed: [event: { id: string; cause: unknown }];
};

export type Event<T> = keyof Events<T>;

export type Listener<T, E extends Event<T>> = KitListener<Events<T>, E>;

/**
 * The imperative contract: unwrapped state + derived + the full method
 * surface. `DeckService<T>` declares `implements` against this, and the
 * fetch action receives it.
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
  // Writable accessor pairs — sets route through the matching mutator.
  query: string;
  keywords: string;
  match: MatchMode;
  selectedFacets: Set<string>;
  readonly facetGroups: FacetGroup[];
  sortField: string;

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

  /**
   * Subscribes a listener to an event. Listeners run in subscription order.
   * An error in a listener propagates to the caller of the write. Returns a
   * function that removes the listener.
   */
  on<E extends Event<T>>(event: E, listener: Listener<T, E>): () => void;
};
