// ---------------------------------------------------------------------------
// Variant data shapes — what each fetch action returns
// ---------------------------------------------------------------------------

export interface BreakdownData {
  labels: string[];
  values: number[];
}

export interface SeriesDataset {
  label: string;
  data: number[];
}

export interface SeriesData {
  labels: string[];
  datasets: SeriesDataset[];
}

export interface DistributionPoint {
  x: number;
  y: number;
  r?: number;
}

export interface DistributionDataset {
  label: string;
  data: DistributionPoint[];
}

export interface DistributionData {
  datasets: DistributionDataset[];
}

export type ComparisonData = SeriesData;

export type VariantData =
  | BreakdownData
  | SeriesData
  | DistributionData
  | ComparisonData;

// ---------------------------------------------------------------------------
// Variant → renderer mapping
// ---------------------------------------------------------------------------

export type BreakdownRenderer = "pie" | "doughnut" | "polarArea" | "bar";
export type SeriesRenderer = "line" | "bar" | "radar";
export type DistributionRenderer = "scatter" | "bubble";
export type ComparisonRenderer = "bar" | "line" | "radar";

// ---------------------------------------------------------------------------
// Bucket sizes for series time grouping
// ---------------------------------------------------------------------------

export type BucketSize = "1h" | "1d" | "1w" | "1mo";

// ---------------------------------------------------------------------------
// Renderer config — the renderer's name, its label, and the options the
// consumer's renderer takes. The machine carries `options` through untouched;
// the rendering side narrows it to its library's option type.
// ---------------------------------------------------------------------------

export interface RendererConfig<R extends string = string> {
  type: R;
  label?: string;
  options?: object;
}

// ---------------------------------------------------------------------------
// Fetch params — per variant type, generic over T. The consumer's fetch
// action closes over its own query/filter context, so the machine passes
// only the chart-driven inputs.
// ---------------------------------------------------------------------------

export interface BreakdownFetchParams<T> {
  field: keyof T;
  limit?: number;
}

export interface SeriesFetchParams<T> {
  field: keyof T;
  bucket: BucketSize;
  range: [Date, Date];
}

export interface DistributionFetchParams<T> {
  x: keyof T;
  y: keyof T;
  range: [Date, Date];
}

export interface ComparisonFetchParams<T> {
  field: keyof T;
  groupBy: keyof T;
  limit?: number;
}

// ---------------------------------------------------------------------------
// Per-variant static config — pure data the consumer declares. No methods:
// the async fetch mechanism lives in `Actions`, keyed by the same variant.
// ---------------------------------------------------------------------------

export interface BreakdownConfig<T> {
  fields: (keyof T)[];
  renderers: RendererConfig<BreakdownRenderer>[];
  limit?: number;
}

export interface SeriesConfig<T> {
  fields: (keyof T)[];
  renderers: RendererConfig<SeriesRenderer>[];
  buckets: BucketSize[];
  defaultRange: [Date, Date];
}

export interface DistributionConfig<T> {
  fields: (keyof T)[];
  renderers: RendererConfig<DistributionRenderer>[];
  defaultRange: [Date, Date];
}

export interface ComparisonConfig<T> {
  fields: (keyof T)[];
  renderers: RendererConfig<ComparisonRenderer>[];
  limit?: number;
}

// ---------------------------------------------------------------------------
// Variant descriptors — the config sub-shape plus its discriminant. Built by
// the service from whichever variant keys the config declares.
// ---------------------------------------------------------------------------

export type BreakdownVariant<T> = { type: "breakdown" } & BreakdownConfig<T>;
export type SeriesVariant<T> = { type: "series" } & SeriesConfig<T>;
export type DistributionVariant<T> = {
  type: "distribution";
} & DistributionConfig<T>;
export type ComparisonVariant<T> = { type: "comparison" } & ComparisonConfig<T>;

export type DataChartVariant<T> =
  | BreakdownVariant<T>
  | SeriesVariant<T>
  | DistributionVariant<T>
  | ComparisonVariant<T>;

/**
 * Config the consumer provides — pure serializable data, zero methods.
 */
export type Config<T> = {
  topic: string;
  colorMap?: Record<string, string>;
  breakdown?: BreakdownConfig<T>;
  series?: SeriesConfig<T>;
  distribution?: DistributionConfig<T>;
  comparison?: ComparisonConfig<T>;
};

/**
 * The state container the service reads and writes: the load flags, the
 * fetched variant data, and the active selection. The container can be a
 * plain object or a reactive proxy. The service replaces each member as a
 * whole, so a proxy tracks every change.
 */
export type State<T> = {
  initialized: boolean;
  loading: boolean;
  variantData: VariantData | null;
  activeVariant: string;
  activeRenderer: string;
  activeField: keyof T | null;
  activeGroupBy: keyof T | null;
  activeX: keyof T | null;
  activeY: keyof T | null;
  activeBucket: BucketSize | null;
  activeRange: [Date, Date] | null;
};

export type StateKey = keyof State<unknown>;

/**
 * The initial active selection, resolved from the first declared variant.
 */
export type ChartDefaults<T> = Pick<
  State<T>,
  | "activeVariant"
  | "activeRenderer"
  | "activeField"
  | "activeGroupBy"
  | "activeX"
  | "activeY"
  | "activeBucket"
  | "activeRange"
>;

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
 * Consumer-supplied fetch mechanism, one per declared variant. Each receives
 * the chart-driven inputs and the live service; a variant exists iff config
 * declares it, and the service guards the matching action's absence.
 */
export type Actions<T> = {
  breakdown?: (
    params: BreakdownFetchParams<T>,
    service: Service<T>,
  ) => Promise<BreakdownData>;
  series?: (
    params: SeriesFetchParams<T>,
    service: Service<T>,
  ) => Promise<SeriesData>;
  distribution?: (
    params: DistributionFetchParams<T>,
    service: Service<T>,
  ) => Promise<DistributionData>;
  comparison?: (
    params: ComparisonFetchParams<T>,
    service: Service<T>,
  ) => Promise<ComparisonData>;
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
 * The events of a chart service, keyed by name. Each value is the argument
 * list of a listener. The service emits after the write lands, so a listener
 * reads the new state.
 *
 * - `change`: any field of the container was written.
 * - `updated`: a fetch settled, success or failure. `data` is the variant data.
 * - `variantChanged`: the active variant was switched.
 * - `rendererChanged`: the active renderer was switched.
 *
 * Field, group, axis, bucket, and range changes all refetch, so they surface
 * through `updated`; variant and renderer are the distinct discrete choices.
 */
export type Events<T> = {
  change: [change: Change<T>];
  updated: [event: { id: string; variant: string; data: VariantData | null }];
  variantChanged: [event: { id: string; variant: string }];
  rendererChanged: [event: { id: string; renderer: string }];
};

export type Event<T> = keyof Events<T>;

export type Listener<T, E extends Event<T>> = (...args: Events<T>[E]) => void;

export type Listeners<M extends EventMap> = {
  [E in keyof M]?: Set<(...args: M[E]) => void>;
};

/**
 * The imperative contract: unwrapped state + derived + the full method
 * surface. `ChartService<T>` declares `implements` against this, and the
 * fetch actions receive it.
 */
export type Service<T> = {
  readonly id: string;
  readonly config: Config<T>;
  readonly variants: DataChartVariant<T>[];

  readonly initialized: boolean;
  readonly loading: boolean;
  readonly variantData: VariantData | null;
  readonly activeVariant: string;
  readonly activeRenderer: string;
  readonly activeField: keyof T | null;
  readonly activeGroupBy: keyof T | null;
  readonly activeX: keyof T | null;
  readonly activeY: keyof T | null;
  readonly activeBucket: BucketSize | null;
  readonly activeRange: [Date, Date] | null;

  readonly activeVariantConfig: DataChartVariant<T>;
  readonly title: string;

  setVariant(type: string): void;
  setRenderer(type: string): void;
  setField(field: string): void;
  setGroupBy(field: string): void;
  setX(field: string): void;
  setY(field: string): void;
  setBucket(bucket: string): void;
  setRange(range: [Date, Date]): void;
  fetch(): Promise<void>;
  init(): Promise<boolean>;

  /**
   * Subscribes a listener to an event. Listeners run in subscription order.
   * An error in a listener propagates to the caller of the write. Returns a
   * function that removes the listener.
   */
  on<E extends Event<T>>(event: E, listener: Listener<T, E>): () => void;
};
