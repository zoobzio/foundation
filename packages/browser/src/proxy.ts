import type {
  Changers,
  Emitter,
  Events,
  Options,
  State,
  StateKey,
} from "./types";

import { keys, rekey, within } from "objectively";
import { BROWSER_STATE_FIELDS } from "./constants";
import { change } from "./util";

/**
 * Makes the active state over a container: a `State<T>`-shaped proxy. A
 * read of a field passes the stored value through the matching
 * `options.get` middleware. A write passes the value through the matching
 * `options.set` middleware, stores the result in the container, and emits
 * `change` with one change object. A key outside the fields goes straight
 * to the container.
 */
export const makeProxy = <T>(
  state: State<T>,
  options: Options<T>,
  emitter: Emitter<Events<T>>,
): State<T> => {
  const fields = keys(BROWSER_STATE_FIELDS);

  const changers = rekey<Record<StateKey, null>, Changers<T>>(
    BROWSER_STATE_FIELDS,
    (field) => [field, change<T>],
  );

  const read = <K extends StateKey>(key: K): State<T>[K] => {
    const through = options.get?.state?.[key];
    const value = state[key];
    return through ? through(value) : value;
  };

  const write = <K extends StateKey>(key: K, value: State<T>[K]): void => {
    const through = options.set?.state?.[key];
    const before = state[key];
    const after = through ? through(value) : value;
    state[key] = after;
    if (emitter.heard("change")) {
      emitter.emit("change", changers[key](key, before, after));
    }
  };

  return new Proxy(state, {
    get: (target, key) =>
      within(fields, key) ? read(key) : Reflect.get(target, key),
    set: (target, key, value) => {
      if (!within(fields, key)) return Reflect.set(target, key, value);
      write(key, value);
      return true;
    },
  });
};
