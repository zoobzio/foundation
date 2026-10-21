import type { Emitter, EventMap, Listeners } from "./types";

/**
 * Makes a typed event bus. Listener sets are created on first use.
 */
export const makeEmitter = <M extends EventMap>(): Emitter<M> => {
  const listeners: Listeners<M> = {};

  const of = <E extends keyof M>(event: E): Set<(...args: M[E]) => void> =>
    (listeners[event] ??= new Set());

  return {
    on: (event, listener) => {
      of(event).add(listener);
      return () => {
        of(event).delete(listener);
      };
    },
    emit: (event, ...args) => {
      for (const listener of Array.from(of(event))) {
        listener(...args);
      }
    },
    heard: (event) => of(event).size > 0,
  };
};
