import type { Loader, LoaderActions, LoaderState } from "./types";

/**
 * Makes the loader of a service that holds what a fetch answered: the
 * first fetch, the fetch, the quiet refresh a sync polls, and the load of
 * a result the owner was handed. It owns the order between them, so each
 * service that loads keeps the same promises:
 *
 * - A fetch that settles after a later one began is dropped: what it
 *   loaded is no longer what was asked for. It lands nothing, leaves
 *   `loading` to the later one, and is not `settled`. A rejection still
 *   reaches its caller.
 * - A refresh is quiet: `loading` is the fetch's alone, so a service kept
 *   alive does not flicker. Nothing is asked before the first fetch, or
 *   while a fetch is out or the owner is `busy`.
 * - A refresh that comes back to an owner that has moved on since (a
 *   fetch began, the mark moved, the owner is busy, or its `version`
 *   changed) is dropped: what happened since is the newer word.
 *
 * The loader writes `loading` and `initialized` to the container and reads
 * `since` from it; the result and the mark are the owner's to write, in
 * `land`. The counter lives in the closure, so a reactive proxy around the
 * owner changes nothing here.
 */
export const makeLoader = <P, R>(
  state: LoaderState,
  actions: LoaderActions<P, R>,
): Loader<R> => {
  /** Counts the fetches begun, and the loads: the last one is the one shown. */
  let request = 0;

  const now = (): string => (actions.now?.() ?? new Date()).toISOString();
  const busy = (): boolean => actions.busy?.() ?? false;

  const fetch = async (): Promise<void> => {
    const id = ++request;
    const params = actions.params();
    const at = now();
    state.loading = true;
    try {
      const result = await actions.fetch(params);
      if (id !== request) return;
      actions.land(result, at);
    } finally {
      if (id === request) {
        state.loading = false;
        actions.settled?.(params);
      }
    }
  };

  const init = async (): Promise<boolean> => {
    if (state.initialized) return true;
    state.initialized = true;
    await fetch();
    return true;
  };

  const refresh = async (since: string): Promise<void> => {
    const ask = actions.refresh;
    if (!ask || !state.initialized || state.loading || busy()) return;
    const id = request;
    const version = actions.version?.();
    const params = actions.params();
    const at = now();
    const answer = await ask(params, since);
    if (answer === undefined || answer === null || answer === false) return;
    const result = answer === true ? await actions.fetch(params) : answer;
    if (
      id !== request ||
      busy() ||
      version !== actions.version?.() ||
      state.since !== since
    ) {
      return;
    }
    actions.land(result, at);
    actions.settled?.(params);
  };

  const load = (result: R): void => {
    request += 1;
    actions.land(result, now());
    state.loading = false;
    state.initialized = true;
    actions.settled?.(actions.params());
  };

  return { init, fetch, refresh, load };
};
