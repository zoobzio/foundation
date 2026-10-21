import type {
  Change as KitChange,
  Changers as KitChangers,
  Changes as KitChanges,
  Listener as KitListener,
  Middleware as KitMiddleware,
  Options as KitOptions,
} from "@zoobzio/kit";

// ---------------------------------------------------------------------------
// Fields — the consumer declares these like table columns
// ---------------------------------------------------------------------------

export type PreviewFieldType = "text" | "markdown";

export interface PreviewField<T> {
  key: keyof T;
  label: string;
  type?: PreviewFieldType;
}

// ---------------------------------------------------------------------------
// Content variant — discriminated union for renderer selection
// ---------------------------------------------------------------------------

export interface CodeContentVariant<T> {
  type: "code";
  key: keyof T;
  language: string;
  externalUrl?: string;
  filename?: string;
}

// Future variants:
// export interface PdfContentVariant<T> { type: "pdf"; key: keyof T; }
// export interface ImageContentVariant<T> { type: "image"; key: keyof T; }

export type ContentVariant<T> = CodeContentVariant<T>;

/**
 * Config the consumer provides — pure serializable data.
 */
export type Config<T> = {
  fields: PreviewField<T>[];
  content: ContentVariant<T>;
};

/**
 * The state container the service reads and writes: the record, the load
 * flag, and the init guard. The container can be a plain object or a
 * reactive proxy. The service replaces each member as a whole, so a proxy
 * tracks every change.
 */
export type State<T> = {
  initialized: boolean;
  loading: boolean;
  data: T | null;
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
 * The consumer-supplied fetch mechanism — the record the preview displays.
 */
export type Actions<T> = {
  fetch: (service: Service<T>) => Promise<T>;
};

/**
 * The events of a preview service, keyed by name. Each value is the
 * argument list of a listener. The service emits after the write lands, so
 * a listener reads the new state.
 *
 * - `change`: any field of the container was written.
 * - `loaded`: a fetch settled, success or failure.
 */
export type Events<T> = {
  change: [change: Change<T>];
  loaded: [event: { id: string }];
};

export type Event<T> = keyof Events<T>;

export type Listener<T, E extends Event<T>> = KitListener<Events<T>, E>;

/**
 * The imperative contract: unwrapped state + derived + the full method
 * surface. `PreviewService<T>` declares `implements` against this, and the
 * fetch action receives it.
 */
export type Service<T> = {
  readonly id: string;
  readonly config: Config<T>;
  readonly fields: PreviewField<T>[];
  readonly content: ContentVariant<T>;

  readonly initialized: boolean;
  readonly loading: boolean;
  readonly data: T | null;

  readonly contentValue: string;
  fieldValue(key: keyof T): unknown;

  init(): Promise<boolean>;
  fetch(): Promise<void>;

  /**
   * Subscribes a listener to an event. Listeners run in subscription order.
   * An error in a listener propagates to the caller of the write. Returns a
   * function that removes the listener.
   */
  on<E extends Event<T>>(event: E, listener: Listener<T, E>): () => void;
};
