import type { Hooks } from "./hooks";
import type {
  Actions,
  Config,
  Events,
  Service,
  State,
} from "@zoobzio/calendar";

/**
 * The slice of the state container a calendar may start from: the view,
 * the date it is anchored on, and the selected occurrence, never what a
 * fetch fills in. It seeds the `useState` record.
 */
export type CalendarInitial = Partial<
  Pick<State, "view" | "date" | "selected">
>;

/**
 * What `createCalendar` takes: the headless config, the actions (the
 * reader, the writer, the fetch, and the save), and the initial state.
 * Config and actions share no key, so they sit side by side.
 */
export type CalendarOptions<I, O> = Config &
  Actions<I, O> & {
    initial?: CalendarInitial;
  };

/**
 * The Nuxt hooks a calendar relays: `calendar:navigated`,
 * `calendar:loaded`, `calendar:changed`, `calendar:selected`,
 * `calendar:filtered`, and `calendar:restored`, each carrying the service's payload with its scoping `id`.
 */
export type CalendarHooks = Hooks<"calendar", Events<unknown>>;

/**
 * The id-scoped composable `createCalendar` returns. Call it in setup;
 * every call yields a service over the same shared container.
 */
export type UseCalendar<I, O> = () => Service<I, O>;
