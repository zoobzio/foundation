import type {
  Actions,
  Config,
  Event,
  Events,
  Listener,
  Options,
  Service,
  State,
} from "./types";
import type { Emitter } from "@zoobzio/kit";

import { makeEmitter, makeProxy } from "@zoobzio/kit";
import { SYNC_INTERVALS, SYNC_OFF, SYNC_STATE_FIELDS } from "./constants";

/**
 * The headless sync machine. Owns the interval a visitor sets, the mark of
 * the last sync, and the loop between them: while it is watched and an
 * interval is set, it waits the interval out and polls for what changed
 * since the mark, one poll at a time, each wait starting when the poll
 * before it settles.
 *
 * It holds no data. Its owner, a service that loads something, supplies
 * the poll and marks each load of its own, so the wait starts over from
 * whatever landed last. Nothing polls before the first mark, and nothing
 * polls unwatched: a view watches while it is on screen, so a service
 * built on a server, or one no view shows, keeps no timer.
 *
 * The service reads and writes the `state` container through the `options`
 * middleware. The container can be a plain object or a reactive proxy, and
 * may be a slice of its owner's. Each write emits `change`.
 */
export class SyncService implements Service {
  readonly intervals: readonly number[];

  private readonly state: State;
  private readonly emitter: Emitter<Events> = makeEmitter();

  /** How many watches are open. The timer runs while there is one. */
  private watches = 0;
  /** Whether this service has a poll out: it runs one at a time. */
  private polling = false;
  /**
   * Stops the wait that is running. The timer is held behind a function:
   * a view may hold the service in a reactive proxy, which wraps an object
   * it reads off the service but hands a function back as it is.
   */
  private cancel: (() => void) | undefined;

  constructor(
    public readonly id: string,
    public readonly config: Config,
    state: State,
    private readonly wiring: Actions,
    options: Options = {},
  ) {
    this.state = makeProxy(state, SYNC_STATE_FIELDS, options, this.emitter);
    this.intervals = config.intervals ?? SYNC_INTERVALS;
  }

  on<E extends Event>(event: E, listener: Listener<E>): () => void {
    return this.emitter.on(event, listener);
  }

  // --- state -----------------------------------------------------------

  get interval(): number {
    return this.state.interval;
  }

  get since(): string | null {
    return this.state.since;
  }

  get syncing(): boolean {
    return this.state.syncing;
  }

  get active(): boolean {
    return this.interval > SYNC_OFF;
  }

  // --- interval --------------------------------------------------------

  setInterval(interval: number): boolean {
    if (interval === this.interval) return false;
    if (interval !== SYNC_OFF && !this.intervals.includes(interval)) {
      return false;
    }
    this.state.interval = interval;
    this.wait();
    this.emitter.emit("changed", { id: this.id, interval });
    return true;
  }

  // --- sync ------------------------------------------------------------

  mark(since: string = new Date().toISOString()): void {
    this.state.since = since;
    this.wait();
  }

  async poll(): Promise<void> {
    const since = this.since;
    if (this.polling || since === null) return;
    this.polling = true;
    this.rest();
    this.state.syncing = true;
    try {
      await this.wiring.poll(since);
      this.emitter.emit("synced", { id: this.id, since: this.since });
    } catch (error) {
      this.emitter.emit("failed", { id: this.id, error });
    } finally {
      this.polling = false;
      this.state.syncing = false;
      this.wait();
    }
  }

  watch(): () => void {
    this.watches += 1;
    if (this.watches === 1) this.wait();
    let open = true;
    return () => {
      if (!open) return;
      open = false;
      this.watches -= 1;
      if (this.watches === 0) this.rest();
    };
  }

  // --- loop ------------------------------------------------------------

  /**
   * Starts the wait over: a whole interval from now, then a poll. No wait
   * runs unwatched, with no interval set, or while a poll is out, which
   * starts the next itself once it settles.
   */
  private wait(): void {
    this.rest();
    if (!this.watches || !this.active || this.polling) return;
    const timer = setTimeout(() => {
      this.cancel = undefined;
      void this.poll();
    }, this.interval);
    this.cancel = () => clearTimeout(timer);
  }

  /** Stops the wait that is running, if one is. */
  private rest(): void {
    this.cancel?.();
    this.cancel = undefined;
  }
}
