import type { Origin, View } from "./types";

const plain = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Whether two payloads hold the same data. Objects compare by their
 * defined members in any order, so a key that is `undefined` is the same
 * as one that is absent; arrays compare member for member, in order;
 * anything else compares by identity. Meant for what a view holds: data
 * that survives JSON.
 */
export const same = (a: unknown, b: unknown): boolean => {
  if (Object.is(a, b)) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, i) => same(item, b[i]));
  }
  if (!plain(a) || !plain(b)) return false;
  const defined = (o: Record<string, unknown>) =>
    Object.keys(o).filter((key) => o[key] !== undefined);
  const keys = defined(a);
  return (
    keys.length === defined(b).length &&
    keys.every((key) => same(a[key], b[key]))
  );
};

const origin = (value: unknown): Origin =>
  value === "system" ? "system" : "user";

/**
 * Reads a stored record as a view with its payload unchecked: an object
 * with a string `id` and `name`. The `origin` is `user` unless the record
 * says `system`. Anything else is not a view.
 */
export const envelope = (value: unknown): View<unknown> | undefined => {
  if (!plain(value)) return undefined;
  const { id, name, payload } = value;
  if (typeof id !== "string" || typeof name !== "string") return undefined;
  return { id, name, payload, origin: origin(value.origin) };
};
