import type { Provider } from "./types";

/**
 * A values provider that waits `ms` before it asks the one given, so a
 * term typed through asks once, for the term the typing stopped on: the
 * query aborts the lookup of a draft it has moved on from, and an aborted
 * wait never asks. A call for more is not a keystroke, and asks at once.
 * The result is a promise either way, so the first page of every term is
 * `loading` for the wait.
 */
export const debounced =
  (provider: Provider, ms: number): Provider =>
  (term, lookup) => {
    if (lookup.cursor !== undefined) return provider(term, lookup);
    const { signal } = lookup;
    return new Promise((resolve, reject) => {
      const abort = () => {
        clearTimeout(timer);
        reject(signal.reason);
      };
      const timer = setTimeout(() => {
        signal.removeEventListener("abort", abort);
        try {
          resolve(provider(term, lookup));
        } catch (error) {
          reject(error);
        }
      }, ms);
      signal.addEventListener("abort", abort, { once: true });
    });
  };
