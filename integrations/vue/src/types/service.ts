/**
 * Anything with the kit's `on`, seen through the event names `E`: a
 * headless service or a bare emitter. A method signature, so a service's
 * generic `on` satisfies it with any payloads.
 */
export type Subscribable<E extends string> = {
  on(event: E, listener: (...args: unknown[]) => void): () => void;
};

/**
 * A component's `defineEmits` return, seen through the event names `E`. A
 * method signature, so Vue's per-event call signatures satisfy it. The
 * payload types are checked where the component derives its emits from
 * the service's events, not here.
 */
export type ServiceEmit<E extends string> = {
  fn(event: E, ...args: unknown[]): void;
}["fn"];
