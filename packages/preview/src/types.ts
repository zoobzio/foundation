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
 * The consumer-supplied fetch mechanism — the record the preview displays.
 */
export type Actions<T> = {
  fetch: (service: Service<T>) => Promise<T>;
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

export type Listener<T, E extends Event<T>> = (...args: Events<T>[E]) => void;

export type Listeners<M extends EventMap> = {
  [E in keyof M]?: Set<(...args: M[E]) => void>;
};

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
