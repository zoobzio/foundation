import type {
  Change as KitChange,
  ChangeEvents,
  Changers as KitChangers,
  Changes as KitChanges,
  Listener as KitListener,
  Middleware as KitMiddleware,
  Options as KitOptions,
} from "@zoobzio/kit";

/**
 * Config the consumer provides. Plain data.
 */
export type Config = {
  /**
   * The intervals a visitor may pick from, in milliseconds, each above
   * zero. Defaults to `SYNC_INTERVALS`. Off is always there to pick, and
   * is no member of the list.
   */
  intervals?: readonly number[];
  /**
   * The interval the sync starts on: one of `intervals`, or `SYNC_OFF`.
   * Defaults to `SYNC_OFF`, so nothing polls until a visitor asks for it.
   * It shapes the container, through `createSyncState`.
   */
  interval?: number;
};

/**
 * The state container the service reads and writes. The container can be a
 * plain object or a reactive proxy.
 *
 * - `interval`: how long the sync waits between polls, in milliseconds.
 *   `SYNC_OFF`, zero, is no polling.
 * - `since`: the mark of the last sync, what a poll is asked for changes
 *   since. `null` until something is marked. A string the service never
 *   reads into: an ISO timestamp by default, or whatever the owner marks.
 * - `syncing`: whether a poll is out.
 */
export type State = {
  interval: number;
  since: string | null;
  syncing: boolean;
};

export type StateKey = keyof State;

export type Middleware = KitMiddleware<State>;
export type Options = KitOptions<State>;
export type Changes = KitChanges<State>;
export type Change<K extends StateKey = StateKey> = KitChange<State, K>;
export type Changers = KitChangers<State>;

/**
 * The behavior the owner supplies: the poll. It is handed the `since` the
 * container holds, asks for what changed, lands it, and calls `mark` where
 * it did. One that throws or rejects emits `failed`, and the sync keeps
 * its pace.
 */
export type Actions = {
  poll: (since: string) => void | Promise<void>;
};

/**
 * The events of a sync service, keyed by name.
 *
 * - `change`: a field of the container was written.
 * - `changed`: the interval changed.
 * - `synced`: a poll settled. `since` is the mark it left.
 * - `failed`: a poll threw or rejected.
 */
export type Events = ChangeEvents<State> & {
  changed: [event: { id: string; interval: number }];
  synced: [event: { id: string; since: string | null }];
  failed: [event: { id: string; error: unknown }];
};

export type Event = keyof Events;

export type Listener<E extends Event> = KitListener<Events, E>;

/**
 * The sync machine: an interval a visitor sets, the mark of the last sync,
 * and the loop that polls for what changed since.
 */
export type Service = {
  readonly id: string;
  readonly config: Config;
  /** The intervals a visitor may pick from, off aside. */
  readonly intervals: readonly number[];

  readonly interval: number;
  readonly since: string | null;
  readonly syncing: boolean;
  /** Whether an interval is set: the sync polls while it is watched. */
  readonly active: boolean;

  /**
   * Sets the interval: one of `intervals`, or `SYNC_OFF`. Any other is
   * refused. The wait starts over from here.
   *
   * @returns Whether the interval changed.
   */
  setInterval(interval: number): boolean;

  /**
   * Marks a sync: what the owner holds is whole as of `since`, which
   * defaults to now, as an ISO timestamp. The wait starts over from here,
   * so a load of the owner's own puts the next poll a whole interval off.
   */
  mark(since?: string): void;

  /**
   * Polls now, whatever the interval, and starts the wait over once it
   * settles. Nothing while a poll is out, or before anything is marked:
   * there is nothing yet to have changed since.
   */
  poll(): Promise<void>;

  /**
   * Watches: the sync polls on its interval from here until the function
   * returned is called. A view watches while it is on screen. Watched
   * more than once, it polls until every watch is over.
   */
  watch(): () => void;

  on<E extends Event>(event: E, listener: Listener<E>): () => void;
};
