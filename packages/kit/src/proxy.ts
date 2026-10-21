import type { ChangeEvents, Changers, Emitter, Fields, Options } from "./types";

import { keys, rekey, within } from "objectively";
import { change } from "./util";

/**
 * Makes the active state over a container: an `S`-shaped proxy. A read of
 * a field passes the stored value through the matching `options.get`
 * middleware. A write passes the value through the matching `options.set`
 * middleware, stores the result in the container, and emits `change` with
 * one change object. A key outside `fields` goes straight to the container.
 */
export const makeProxy = <S extends object>(
  state: S,
  fields: Fields<S>,
  options: Options<S>,
  emitter: Emitter<ChangeEvents<S>>,
): S => {
  const names = keys(fields);

  const changers = rekey<Fields<S>, Changers<S>>(fields, (field) => [
    field,
    change<S, typeof field>,
  ]);

  const read = <K extends keyof S>(key: K): S[K] => {
    const through = options.get?.state?.[key];
    const value = state[key];
    return through ? through(value) : value;
  };

  const write = <K extends keyof S>(key: K, value: S[K]): void => {
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
      within(names, key) ? read(key) : Reflect.get(target, key),
    set: (target, key, value) => {
      if (!within(names, key)) return Reflect.set(target, key, value);
      write(key, value);
      return true;
    },
  });
};
