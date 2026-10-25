import type { Hooks } from "./hooks";
import type { Actions, Config, Events, Service } from "@zoobzio/editor";

/**
 * What `createEditor` takes: the headless config (the feature set) and the
 * actions (the reader, the writer, and any extensions). Config and actions
 * share no key, so they sit side by side. The container carries nothing a
 * consumer would seed: its fields follow the document, which the service
 * holds and `load` sets.
 */
export type EditorOptions<I, O> = Config & Actions<I, O>;

/**
 * The Nuxt hooks an editor relays: `editor:loaded`, `editor:updated`,
 * `editor:mounted`, and `editor:unmounted`, each carrying the service's
 * payload with its scoping `id`.
 */
export type EditorHooks = Hooks<"editor", Events>;

/**
 * The id-scoped composable `createEditor` returns. Call it in setup; every
 * call yields a service over the same shared container, each with an
 * editor of its own.
 */
export type UseEditor<I, O> = () => Service<I, O>;
