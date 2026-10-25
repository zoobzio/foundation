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
