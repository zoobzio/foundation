import { createDefu } from "defu";
import { record } from "objectively";

type Manifest = Record<PropertyKey, unknown>;

/**
 * Whether a value is callable. Narrows without a cast; the caller checks
 * the result's shape with `record` before merging it.
 */
const callable = (value: unknown): value is (...args: unknown[]) => unknown =>
  typeof value === "function";

/**
 * Replaces the local array with the user's. Listeners and other functions
 * fall through to defu, where the user's value wins.
 */
const arrays = (object: Manifest, key: PropertyKey, value: unknown) => {
  if (Array.isArray(object[key]) && Array.isArray(value)) {
    object[key] = value;
    return true;
  }
  return false;
};

/**
 * Deep merge of one part's props where `user` wins per key. An array
 * replaces the local array; a listener replaces the local listener.
 */
const props = createDefu(arrays);

/**
 * Deep merge of a part manifest where `user` wins per key. A static part
 * merges its props. A function part composes: the merged part calls both
 * with the same arguments and merges the user's result over the local one,
 * so a per-item part takes a partial override like a static part does.
 * Only top-level parts compose; a listener inside a part still replaces.
 */
export const merge: (user: Manifest, local: Manifest) => Manifest = createDefu(
  (object: Manifest, key: PropertyKey, value: unknown, namespace: string) => {
    if (arrays(object, key, value)) return true;
    const local = object[key];
    if (namespace === "" && callable(local) && callable(value)) {
      object[key] = (...args: unknown[]) => {
        const over = value(...args);
        const base = local(...args);
        return record(over) && record(base) ? props(over, base) : over;
      };
      return true;
    }
    return false;
  },
);
