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
 * One middleware slot per state field. A slot receives the value of its
 * field and returns the value the service uses. A missing slot passes the
 * value on.
 */
export type Middleware<T> = {
  [K in StateKey]?: (value: State<T>[K]) => State<T>[K];
};

/**
 * The middleware for reads and writes of the state container.
 */
export type Options<T> = {
  get?: { state?: Middleware<T> };
  set?: { state?: Middleware<T> };
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
 * The change object of each field: the field name with the stored values
 * around the write, after the `set` middleware.
 */
export type Changes<T> = {
  [K in keyof State<T>]: { field: K; before: State<T>[K]; after: State<T>[K] };
};

/**
 * A write to one field of the container. With no `K`, the union over every
 * field; `field` discriminates.
 */
export type Change<T, K extends StateKey = StateKey> = Changes<T>[K];

/**
 * The change builder of each field. A lookup by a generic key yields the
 * change object of that field, which an object literal cannot express
 * without a cast.
 */
export type Changers<T> = {
  [K in keyof State<T>]: (
    field: K,
    before: State<T>[K],
    after: State<T>[K],
  ) => Changes<T>[K];
};

/**
 * An event map: each key is an event name, each value the argument list of
 * its listeners.
 */
export type EventMap = Record<string, unknown[]>;

/**
 * A typed event bus over an event map.
 */
export type Emitter<M extends EventMap> = {
  /**
   * Subscribes a listener to an event. Returns the function that removes it.
   */
  on: <E extends keyof M>(
    event: E,
    listener: (...args: M[E]) => void,
  ) => () => void;
  /**
   * Calls the listeners of an event, in subscription order, over a copy, so
   * a listener can unsubscribe during the call.
   */
  emit: <E extends keyof M>(event: E, ...args: M[E]) => void;
  /**
   * Whether an event has a listener. Skips the work of an event payload when
   * nothing listens.
   */
  heard: (event: keyof M) => boolean;
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

export type Listener<T, E extends Event<T>> = (...args: Events<T>[E]) => void;

export type Listeners<M extends EventMap> = {
  [E in keyof M]?: Set<(...args: M[E]) => void>;
};

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
