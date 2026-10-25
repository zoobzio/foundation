import type { Hooks } from "./hooks";
import type { Actions, Config, Events, Service } from "@zoobzio/code";

/**
 * What `createCode` takes: the headless config (the feature set) and the
 * actions (the reader, the writer, and the CodeMirror extensions). Config
 * and actions share no key, so they sit side by side. The container
 * carries nothing a consumer would seed: its fields follow the document,
 * which the service holds and `load` sets.
 */
export type CodeOptions<I, O> = Config & Actions<I, O>;

/**
 * The Nuxt hooks a code editor relays: `code:loaded`, `code:updated`,
 * `code:mounted`, and `code:unmounted`, each carrying the service's
 * payload with its scoping `id`.
 */
export type CodeHooks = Hooks<"code", Events>;

/**
 * The id-scoped composable `createCode` returns. Call it in setup; every
 * call yields a service over the same shared container, each with an
 * editor of its own.
 */
export type UseCode<I, O> = () => Service<I, O>;
