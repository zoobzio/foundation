import type { Hooks } from "./hooks";
import type {
  Actions,
  Config,
  Events,
  RecordData,
  Service,
  State,
} from "@zoobzio/timeline";

/**
 * The slice of the state container a timeline may start from: the
 * selected record, never what a fetch fills in. It seeds the `useState`
 * record.
 */
export type TimelineInitial<T extends RecordData> = Partial<
  Pick<State<T>, "selected">
>;

/**
 * What `createTimeline` takes: the headless config, the actions (the
 * fetch and the refresh), and the initial state. Config and actions share
 * no key, so they sit side by side.
 */
export type TimelineOptions<T extends RecordData> = Config<T> &
  Actions<T> & {
    initial?: TimelineInitial<T>;
  };

/**
 * The Nuxt hooks a timeline relays: `timeline:loaded`,
 * `timeline:appended`, `timeline:selected`, `timeline:filtered`, and
 * `timeline:restored`, each carrying the service's payload with its
 * scoping `id`.
 */
export type TimelineHooks = Hooks<"timeline", Events<RecordData>>;

/**
 * The id-scoped composable `createTimeline` returns. Call it in setup;
 * every call yields a service over the same shared container.
 */
export type UseTimeline<T extends RecordData> = () => Service<T>;
