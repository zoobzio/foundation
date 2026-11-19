/**
 * One middleware slot per field of a state container `S`. A slot receives
 * the value of its field and returns the value the service uses. A missing
 * slot passes the value on.
 */
export type Middleware<S> = {
  [K in keyof S]?: (value: S[K]) => S[K];
};

/**
 * The middleware for reads and writes of a state container.
 */
export type Options<S> = {
  get?: { state?: Middleware<S> };
  set?: { state?: Middleware<S> };
};

/**
 * The fields of a state container, as a record keyed by field name. The
 * proxy uses the keys to tell a container field from any other key.
 */
export type Fields<S> = Record<keyof S, null>;

/**
 * The change object of each field: the field name with the stored values
 * around the write, after the `set` middleware.
 */
export type Changes<S> = {
  [K in keyof S]: { field: K; before: S[K]; after: S[K] };
};

/**
 * A write to one field of the container. With no `K`, the union over every
 * field; `field` discriminates.
 */
export type Change<S, K extends keyof S = keyof S> = Changes<S>[K];

/**
 * The change builder of each field. A lookup by a generic key yields the
 * change object of that field, which an object literal cannot express
 * without a cast.
 */
export type Changers<S> = {
  [K in keyof S]: (field: K, before: S[K], after: S[K]) => Changes<S>[K];
};

/**
 * The one event every state container emits: `change`, with the change
 * object of the written field. A service's event map extends this.
 */
export type ChangeEvents<S> = {
  change: [change: Change<S>];
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
 * A listener of one event of an event map.
 */
export type Listener<M extends EventMap, E extends keyof M> = (
  ...args: M[E]
) => void;

export type Listeners<M extends EventMap> = {
  [E in keyof M]?: Set<(...args: M[E]) => void>;
};

/**
 * One step of a transform: a value in one form to a value in another,
 * given a context `C` the service provides. A step that needs no context
 * takes one argument.
 */
export type Step<A, B, C> = (value: A, context: C) => B;

/**
 * A reader and a writer around a service's own form `D`: `read` takes a
 * source in the consumer's form `I` to it; `write` takes it to the
 * consumer's form `O`. Ingestion and consumption may differ in form. Each
 * step receives the service's context `C`, so a transform asks the service
 * what it models and never guesses.
 */
export type Codec<I, D, O, C> = {
  read: Step<I, D, C>;
  write: Step<D, O, C>;
};

/**
 * The forms text a service carries can take beyond a plain string. Empty
 * here, so {@link Text} is `string`: a layer that resolves messages widens
 * it by declaration merging, and every `label`, `placeholder` or `hint`
 * the packages carry then accepts a message wherever that layer is in use.
 * The packages never read the text; the layer resolves it before a view
 * or a service sees it.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TextMap {}

/**
 * Text a service carries and a view renders: a plain string, or a message
 * in any form {@link TextMap} admits.
 */
export type Text = string | TextMap[keyof TextMap];

/**
 * The fields of a container a loader reads and writes: whether a fetch is
 * out, whether the first fetch was asked for, and the mark of what is
 * held, which a sync keeps. A service's own container carries them among
 * its fields.
 */
export type LoaderState = {
  loading: boolean;
  initialized: boolean;
  since: string | null;
};

/**
 * What a refresh answers. Nothing, or `false`: nothing changed, and the
 * owner keeps what it holds. `true`: something did, and the loader fetches
 * again itself. Anything else is the result as it now stands, landed as a
 * fetch's is.
 */
export type Refreshed<R> = R | boolean | null | undefined | void;

/**
 * What the owner of a loader supplies. `P` is what its fetch is handed,
 * `R` what the fetch answers.
 */
export type LoaderActions<P, R> = {
  /** What the fetch is handed, as the container stands. */
  params: () => P;
  /** Loads a result. */
  fetch: (params: P) => Promise<R>;
  /**
   * Asks what changed since the mark. Without it the loader's `refresh`
   * does nothing.
   */
  refresh?: (params: P, since: string) => Refreshed<R> | Promise<Refreshed<R>>;
  /**
   * Lands a result in the container, and marks the sync with it: `at` is
   * the time its request was made, the mark of a result that names none
   * of its own, so a change made while the request was out is not passed
   * over.
   */
  land: (result: R, at: string) => void;
  /**
   * Called once a fetch settles, success or failure, a refresh lands, or
   * a result is loaded, with the params it was asked with: where the
   * owner emits its event.
   */
  settled?: (params: P) => void;
  /** The clock a request's time is read from. Defaults to the system's. */
  now?: () => Date;
  /**
   * Whether the owner has work out that a refresh must not land over: a
   * save, say. Nothing is refreshed while it does.
   */
  busy?: () => boolean;
  /**
   * What the owner holds, as a value that moves when it changes by
   * another hand than the loader's: a revision, say. A refresh that comes
   * back to another version is dropped.
   */
  version?: () => unknown;
};

/**
 * The loader of a service: the order between its first fetch, its
 * fetches, the refreshes its sync polls, and the results it is handed.
 */
export type Loader<R> = {
  /** Fetches once, where the container was not initialized. */
  init(): Promise<boolean>;
  /** Fetches. A fetch that settles after a later one began is dropped. */
  fetch(): Promise<void>;
  /** The poll of a sync: asks what changed since the mark, and lands it. */
  refresh(since: string): Promise<void>;
  /** Lands a result with no fetch. A fetch that is out is dropped. */
  load(result: R): void;
};
