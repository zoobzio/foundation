/**
 * An action as the layer takes it: the headless descriptor (how it renders)
 * with its handler (what it does) under one key, so the two halves the
 * services keep apart cannot drift. `split` takes them apart again.
 */
export type Bound<D extends object, F> = D & { action: F };
