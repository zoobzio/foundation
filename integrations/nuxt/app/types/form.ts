import type { Hooks } from "./hooks";
import type { Actions, Config, Events, Service, State } from "@zoobzio/form";

/**
 * The slice of the state container a form may start from: the payload and
 * the touched keys. The payload here is the first render's, distinct from
 * `defaults`, which is what `reset` returns to. It seeds the `useState`
 * record, so it must survive Nuxt's payload (devalue carries the `Set` and
 * any `Date`).
 */
export type FormInitial<T> = Partial<Pick<State<T>, "payload" | "touched">>;

/**
 * What `createForm` takes: the headless config, the lifecycle actions and
 * middleware, and the initial state. Config and actions share no key, so
 * they sit side by side.
 */
export type FormOptions<T> = Config<T> &
  Actions<T> & {
    initial?: FormInitial<T>;
  };

/**
 * The Nuxt hooks a form relays: `form:initialized`, `form:submitted`,
 * `form:rejected`, `form:restored`, `form:reset`, and `form:failed`, each
 * carrying the service's payload with its scoping `id`.
 */
export type FormHooks = Hooks<"form", Events<unknown>>;

/**
 * The id-scoped composable `createForm` returns. Call it in setup; every
 * call yields a service over the same shared container.
 */
export type UseForm<T> = () => Service<T>;
