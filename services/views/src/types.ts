import type {
  Change as KitChange,
  Changers as KitChangers,
  Changes as KitChanges,
  Listener as KitListener,
  Middleware as KitMiddleware,
  Options as KitOptions,
} from "@zoobzio/kit";
import type { ZodType } from "zod";

/**
 * Where a view comes from. A `system` view is the app's, or one the user
 * inherits: it can be selected and copied, never saved over, renamed, or
 * removed. A `user` view is the user's own.
 */
export type Origin = "system" | "user";

/**
 * A saved view: a named payload. `P` is what the schema yields, the
 * configuration of whatever the views are over.
 */
export type View<P> = {
  id: string;
  name: string;
  origin: Origin;
  payload: P;
};

/**
 * A view as the config names it: the origin defaults to `system`.
 */
export type Seed<P> = Omit<View<P>, "origin"> & { origin?: Origin };

/**
 * An action the service holds until it is resolved, as it would lose
 * something: a `select` or a `revert` the edits made since the active view
 * was applied, a `remove` the view.
 */
export type Intent =
  | { kind: "select"; id: string }
  | { kind: "revert" }
  | { kind: "remove"; id: string };

/**
 * How a pending intent resolves. `save` saves the edits and carries the
 * intent out, `proceed` carries it out as it stands, and `cancel` drops it.
 */
export type Resolution = "save" | "proceed" | "cancel";

/**
 * Config the consumer provides: the Zod schema of a payload, which `P` is
 * inferred from, and the views the app starts with.
 */
export type Config<P> = {
  schema: ZodType<P>;
  /** The app's own views. Their payloads are read through the schema. */
  views?: Seed<P>[];
  /** The id of the view active at first. Defaults to the first view. */
  initial?: string;
  /**
   * Whether two payloads are the same view. Both have been through the
   * schema. Defaults to `same`: structural equality, object keys in any
   * order and arrays in theirs.
   */
  equals?: (a: P, b: P) => boolean;
};

/**
 * The state container the service reads and writes. The container can be
 * a plain object or a reactive proxy. The service replaces each member as
 * a whole, so a proxy tracks every change.
 *
 * `stale` holds the stored views whose payload the schema no longer
 * accepts. They are kept apart, never applied, and can be removed.
 */
export type State<P> = {
  views: View<P>[];
  stale: View<unknown>[];
  active: string | null;
  pending: Intent | null;
  loading: boolean;
  saving: boolean;
  initialized: boolean;
};

export type StateKey = keyof State<unknown>;

/**
 * The kit's state mechanisms bound to this service's container: per-field
 * middleware, the read/write options, and the change objects.
 */
export type Middleware<P> = KitMiddleware<State<P>>;
export type Options<P> = KitOptions<State<P>>;
export type Changes<P> = KitChanges<State<P>>;
export type Change<P, K extends StateKey = StateKey> = KitChange<State<P>, K>;
export type Changers<P> = KitChangers<State<P>>;

/**
 * The consumer-supplied behavior. `read` and `apply` join the views to
 * what they are over: the service holds no copy of the live payload.
 * `load`, `save`, and `remove` are the storage, each optional: without
 * them the views live in the container alone.
 */
export type Actions<P> = {
  /** The payload as it stands now, in whatever the views are over. */
  read: () => P;
  /** Puts a view's payload in place. Afterwards `read` must return it. */
  apply: (payload: P) => void | Promise<void>;
  /**
   * The stored views. Each record is checked: one that is not a view is
   * dropped, one whose payload fails the schema goes to `stale`.
   */
  load?: (service: Service<P>) => Promise<unknown[]>;
  /** Stores a view: a new one, new edits, or a new name. */
  save?: (view: View<P>, service: Service<P>) => Promise<void>;
  /** Deletes a stored view. A stale one carries an unchecked payload. */
  remove?: (view: View<unknown>, service: Service<P>) => Promise<void>;
  /** The id of a new view. Defaults to `crypto.randomUUID`. */
  key?: () => string;
};

/**
 * The stage of the lifecycle a failure came from.
 */
export type FailureStage = "init" | "apply" | "save" | "rename" | "remove";

/**
 * The events of a views service, keyed by name. Each value is the argument
 * list of a listener. The service emits after the write lands, so a listener
 * reads the new state.
 *
 * - `change`: any field of the container was written.
 * - `initialized`: the stored views loaded and the active view was applied.
 * - `selected`: the active view changed. `from` is the id it changed from.
 * - `saved`: a view was stored. `created` tells a new view from new edits.
 * - `renamed`: a view took a new name.
 * - `removed`: a view was deleted.
 * - `reverted`: the active view was applied again over the edits.
 * - `failed`: an action threw. The error is rethrown to the caller after
 *   the event; `cause` carries it.
 */
export type Events<P> = {
  change: [change: Change<P>];
  initialized: [event: { id: string; views: View<P>[] }];
  selected: [event: { id: string; view: View<P>; from: string | null }];
  saved: [event: { id: string; view: View<P>; created: boolean }];
  renamed: [event: { id: string; view: View<P> }];
  removed: [event: { id: string; view: View<unknown> }];
  reverted: [event: { id: string; view: View<P> }];
  failed: [event: { id: string; stage: FailureStage; cause: unknown }];
};

export type Event<P> = keyof Events<P>;

export type Listener<P, E extends Event<P>> = KitListener<Events<P>, E>;

/**
 * Skips the confirmation of an action that would lose something.
 */
export type Force = { force?: boolean };

/**
 * The imperative contract: unwrapped state, what derives from it, and the
 * method surface. `ViewsService<P>` declares `implements` against this,
 * and the actions receive it.
 */
export type Service<P> = {
  readonly id: string;
  readonly config: Config<P>;

  readonly views: View<P>[];
  readonly stale: View<unknown>[];
  readonly active: string | null;
  readonly pending: Intent | null;
  readonly loading: boolean;
  readonly saving: boolean;
  readonly initialized: boolean;

  /** The active view. */
  readonly current: View<P> | undefined;
  /** What `read` returns, through the schema. */
  readonly payload: P;
  /**
   * Whether the payload has moved off the active view: `read`, through
   * the schema, against the view's payload. `false` before `init` and
   * with no active view. Derived on each access, so a reactive `read`
   * makes it reactive.
   */
  readonly drifted: boolean;
  /** Whether the active view is the user's own to save over. */
  readonly editable: boolean;

  /** Loads the stored views and applies the active one. */
  init(): Promise<boolean>;

  /**
   * Makes a view the active one and applies its payload. While the
   * active view has drifted the selection is held as `pending` instead,
   * unless forced.
   *
   * @returns Whether the active view changed.
   */
  select(id: string, options?: Force): Promise<boolean>;

  /** Stores the payload as it stands on the active view. */
  save(): Promise<void>;
  /** Stores the payload as it stands as a new view, and makes it active. */
  saveAs(name: string): Promise<View<P>>;
  rename(id: string, name: string): Promise<void>;
  /**
   * Deletes a view. Held as `pending` unless forced. Removing the active
   * view selects the first that is left.
   */
  remove(id: string, options?: Force): Promise<void>;
  /**
   * Applies the active view over the edits. Held as `pending` unless
   * forced; nothing to do when it has not drifted.
   */
  revert(options?: Force): Promise<void>;

  /**
   * Settles the pending intent. `save` is for a held `select`: it stores
   * the edits on the active view, or as a new view under `name` where the
   * active view is not the user's, then selects. A failure leaves the
   * intent pending and the payload as it was.
   */
  resolve(resolution: Resolution, name?: string): Promise<void>;

  /**
   * Subscribes a listener to an event. Listeners run in subscription order.
   * An error in a listener propagates to the caller of the write. Returns a
   * function that removes the listener.
   */
  on<E extends Event<P>>(event: E, listener: Listener<P, E>): () => void;
};
