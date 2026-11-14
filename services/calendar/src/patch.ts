import type { PatchObject } from "./jscalendar";

import { CALENDAR_OVERRIDE_CLOSED, CALENDAR_OVERRIDE_FIXED } from "./constants";

type Json = Record<string, unknown> | unknown[];

const isJson = (value: unknown): value is Json =>
  typeof value === "object" && value !== null;

/** The reference tokens of a pointer, unescaped. */
const tokens = (pointer: string): string[] =>
  pointer.split("/").map((t) => t.replace(/~1/g, "/").replace(/~0/g, "~"));

/** Whether one pointer leads to or through the other. */
export const overlaps = (a: string, b: string): boolean =>
  a === b || a.startsWith(`${b}/`) || b.startsWith(`${a}/`);

/** A copy as plain JSON, whatever proxy the value is read through. */
export const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value));

/**
 * Applies a patch to a copy of an object and returns the copy. A value
 * sets the property its pointer names; `null` removes it. The patch is
 * applied whole or not at all: a pointer that leads through a property
 * that is not there, that names an array member that is not there or
 * removes one, or that leads through another pointer of the patch throws,
 * and the object is as it was.
 */
export const patch = <T extends object>(target: T, changes: PatchObject): T => {
  const result = copy(target);
  if (isJson(result)) write(result, changes);
  return result;
};

const write = (result: Json, changes: PatchObject): void => {
  const pointers = Object.keys(changes);
  for (const [i, a] of pointers.entries()) {
    for (const b of pointers.slice(i + 1)) {
      if (overlaps(a, b)) throw new Error(`Patch "${a}" overlaps "${b}"`);
    }
  }
  for (const pointer of pointers) {
    const path = tokens(pointer);
    const last = path.pop() ?? "";
    let parent: Json = result;
    for (const token of path) {
      const next: unknown = Array.isArray(parent)
        ? parent[Number(token)]
        : parent[token];
      if (!isJson(next)) throw new Error(`Patch "${pointer}" has no parent`);
      parent = next;
    }
    const value = copy(changes[pointer]);
    if (Array.isArray(parent)) {
      const index = /^(0|[1-9]\d*)$/.test(last) ? Number(last) : -1;
      if (index < 0 || index >= parent.length || value === null) {
        throw new Error(`Patch "${pointer}" is not a member to replace`);
      }
      parent[index] = value;
    } else if (value === null) {
      delete parent[last];
    } else {
      parent[last] = value;
    }
  }
};

/**
 * Whether a patch may stand in `recurrenceOverrides`: an exclusion alone,
 * or changes that leave the entry's identity and its recurrence be.
 */
export const overrides = (changes: PatchObject): boolean => {
  const pointers = Object.keys(changes);
  if ("excluded" in changes) {
    return pointers.length === 1 && changes.excluded === true;
  }
  return pointers.every((pointer) => {
    const path = pointer.split("/");
    if (CALENDAR_OVERRIDE_CLOSED.includes(path[0] ?? "")) return false;
    return !CALENDAR_OVERRIDE_FIXED.some((fixed) => {
      const shape = fixed.split("/");
      return (
        shape.length === path.length &&
        shape.every((token, i) => token === "*" || token === path[i])
      );
    });
  });
};

/**
 * Lays one patch over another, as two patches to the same object applied
 * in turn: a later pointer replaces the earlier one it equals or leads
 * through, and is applied inside an earlier value it leads into.
 */
export const merge = (
  earlier: PatchObject,
  later: PatchObject,
): PatchObject => {
  const result: PatchObject = { ...earlier };
  for (const [pointer, value] of Object.entries(later)) {
    const above = Object.keys(result).find((held) =>
      pointer.startsWith(`${held}/`),
    );
    const outer = above === undefined ? undefined : result[above];
    if (above !== undefined && isJson(outer)) {
      result[above] = patch(outer, {
        [pointer.slice(above.length + 1)]: value,
      });
      continue;
    }
    for (const held of Object.keys(result)) {
      if (overlaps(held, pointer)) delete result[held];
    }
    result[pointer] = value;
  }
  return result;
};
