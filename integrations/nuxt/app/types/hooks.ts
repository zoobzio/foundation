/**
 * A service's domain events as Nuxt runtime hooks: each event name under
 * the feature's prefix, each listener taking the event's arguments. The
 * `change` event (every field write of the container) stays off the bus.
 */
export type Hooks<P extends string, E extends Record<string, unknown[]>> = {
  [K in keyof E as K extends "change" ? never : `${P}:${K & string}`]: (
    ...args: E[K]
  ) => void;
};
