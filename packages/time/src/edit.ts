import type {
  Entry,
  LocalDateTime,
  PatchObject,
  TimeZoneId,
} from "./jscalendar";
import type { Found } from "./types";

import { copy, merge, overrides, patch } from "./patch";
import { recurs, ruleOf } from "./recur";
import { local, normal, shift, stamp, zoned } from "./zone";

/**
 * How much of a recurring entry a change reaches: the one occurrence, the
 * occurrence and every later one, or the whole entry. An entry that does
 * not recur has `all` alone.
 */
export type Scope = "one" | "following" | "all";

/**
 * A change to the entries, worked out and not yet made: how far it
 * reached, the entries as they stand after it, the ones to store, new or
 * replaced by `uid`, and the ones to delete. A change to an occurrence
 * and every later one stores two: the entry cut short, and the new one
 * that follows it.
 */
export type Edit = {
  scope: Scope;
  entries: Entry[];
  stored: Entry[];
  removed: Entry[];
};

/**
 * What an edit reads of its owner: the zone a floating entry is placed
 * in, the time an entry's `updated` is stamped with, and the `uid` of an
 * entry the edit makes.
 */
export type Editing = {
  zone: TimeZoneId;
  now: Date;
  uid: () => string;
};

/** An entry as changed now: its `updated` and its `sequence` moved on. */
const touch = <T extends Entry>(entry: T, now: Date): T => ({
  ...entry,
  updated: stamp(now),
  sequence: (entry.sequence ?? 0) + 1,
});

/** The entries with the one at an index replaced by others, or by none. */
const replaced = (entries: Entry[], index: number, by: Entry[]): Entry[] => [
  ...entries.slice(0, index),
  ...by,
  ...entries.slice(index + 1),
];

/**
 * The entry an edit reaches through an occurrence, and how far. An entry
 * that does not recur is reached whole. A recurring one is reached at the
 * one occurrence unless the scope says otherwise; `following` from its
 * first occurrence is the whole entry, and an entry with no rule has no
 * later occurrences to follow, so it is the one.
 */
const target = (
  entries: Entry[],
  found: Found[],
  key: string,
  scope?: Scope,
): { source: Entry; index: number; id?: LocalDateTime; reach: Scope } => {
  const hit = found.find((f) => f.occurrence.key === key);
  const source = hit === undefined ? undefined : entries[hit.source];
  if (hit === undefined || source === undefined) {
    throw new Error(`No occurrence "${key}" in the range`);
  }
  const index = hit.source;
  const id = hit.occurrence.recurrenceId;
  if (!recurs(source) || id === undefined || source.start === undefined) {
    return { source, index, reach: "all" };
  }
  let reach = scope ?? "one";
  if (reach === "following") {
    if (source.recurrenceRule === undefined) reach = "one";
    else if (id <= normal(source.start)) reach = "all";
  }
  return { source, index, id, reach };
};

/** An entry with the override of one occurrence rewritten. */
const override = (
  source: Entry,
  id: LocalDateTime,
  write: (held: PatchObject) => PatchObject,
  now: Date,
): Entry => {
  const next = copy(source);
  const held = next.recurrenceOverrides ?? {};
  const at = Object.keys(held).find((k) => normal(k) === id) ?? id;
  next.recurrenceOverrides = { ...held, [at]: write(held[at] ?? {}) };
  return touch(next, now);
};

/**
 * Cuts a recurring entry in two at an occurrence, as JSCalendar makes a
 * change to this and every later occurrence: the entry, its rule ending
 * at the occurrence before, and a new entry that starts at the
 * occurrence and carries the rule on. Each names the other in
 * `relatedTo`, the first as `next` and the second as `first`, and each
 * keeps the overrides of its own side.
 */
const split = (
  source: Entry,
  id: LocalDateTime,
  editing: Editing,
): [Entry, Entry] => {
  const head = copy(source);
  const tail = copy(source);
  const rule = source.recurrenceRule;
  const from = source.start;
  if (rule === undefined || from === undefined) {
    throw new Error(`Entry "${source.uid}" has no rule to cut`);
  }
  const zone = source.timeZone ?? editing.zone;
  const at = zoned(id, zone);
  const run = ruleOf(rule, zoned(from, zone));
  const last = run.previous(at, false);
  const { count, ...open } = copy(rule);

  head.recurrenceRule = {
    ...open,
    until: last === null ? normal(from) : local(last),
  };
  tail.recurrenceRule =
    count === undefined
      ? { ...open }
      : {
          ...open,
          count: Math.max(
            1,
            count - run.all((occurrence) => local(occurrence) < id).length,
          ),
        };

  const held = Object.entries(source.recurrenceOverrides ?? {});
  const before = held.filter(([k]) => normal(k) < id);
  const after = held.filter(([k]) => normal(k) >= id);
  delete head.recurrenceOverrides;
  delete tail.recurrenceOverrides;
  if (before.length)
    head.recurrenceOverrides = copy(Object.fromEntries(before));
  if (after.length) tail.recurrenceOverrides = copy(Object.fromEntries(after));

  const uid = editing.uid();
  const first =
    Object.entries(source.relatedTo ?? {}).find(
      ([, relation]) => relation.relation?.first === true,
    )?.[0] ?? source.uid;
  head.relatedTo = {
    ...head.relatedTo,
    [uid]: { relation: { next: true } },
  };
  tail.relatedTo = { [first]: { relation: { first: true } } };
  tail.uid = uid;
  tail.start = id;
  if (tail["@type"] === "Task" && tail.due !== undefined) {
    tail.due = shift(tail.due, from, id);
  }
  delete tail.sequence;
  return [touch(head, editing.now), { ...tail, updated: stamp(editing.now) }];
};

/** The edit that adds an entry. */
export const createEntry = (entries: Entry[], entry: Entry): Edit => ({
  scope: "all",
  entries: [...entries, entry],
  stored: [entry],
  removed: [],
});

/**
 * The edit that patches an occurrence, an occurrence and every later one,
 * or its whole entry. `found` is the expansion the key is read from. `one`
 * writes the patch into the entry's `recurrenceOverrides`; `following`
 * cuts the entry's rule short and adds the entry that follows it; `all`
 * patches the entry. Throws for a key the expansion does not hold, and
 * for a patch of one occurrence that would change its entry.
 */
export const updateEntry = (
  entries: Entry[],
  found: Found[],
  key: string,
  changes: PatchObject,
  scope: Scope | undefined,
  editing: Editing,
): Edit => {
  const { source, index, id, reach } = target(entries, found, key, scope);
  if (reach === "one" && id !== undefined) {
    if (!overrides(changes) || "excluded" in changes) {
      throw new Error(`A patch of one occurrence cannot change its entry`);
    }
    const next = override(
      source,
      id,
      (held) => merge(held, changes),
      editing.now,
    );
    return {
      scope: reach,
      entries: replaced(entries, index, [next]),
      stored: [next],
      removed: [],
    };
  }
  if (reach === "following" && id !== undefined) {
    const [head, tail] = split(source, id, editing);
    const next = patch(tail, changes);
    // The overrides were keyed to the old start; a new start leaves them
    // naming occurrences the rule no longer gives.
    if ("start" in changes) delete next.recurrenceOverrides;
    return {
      scope: reach,
      entries: replaced(entries, index, [head, next]),
      stored: [head, next],
      removed: [],
    };
  }
  const next = touch(patch(source, changes), editing.now);
  return {
    scope: "all",
    entries: replaced(entries, index, [next]),
    stored: [next],
    removed: [],
  };
};

/**
 * The edit that removes an occurrence, an occurrence and every later one,
 * or its entry. `one` excludes the occurrence; `following` ends the
 * entry's rule before it; `all` removes the entry.
 */
export const removeEntry = (
  entries: Entry[],
  found: Found[],
  key: string,
  scope: Scope | undefined,
  editing: Editing,
): Edit => {
  const { source, index, id, reach } = target(entries, found, key, scope);
  if (reach === "one" && id !== undefined) {
    const next = override(source, id, () => ({ excluded: true }), editing.now);
    return {
      scope: reach,
      entries: replaced(entries, index, [next]),
      stored: [next],
      removed: [],
    };
  }
  if (reach === "following" && id !== undefined) {
    const [head] = split(source, id, editing);
    delete head.relatedTo;
    if (source.relatedTo) head.relatedTo = copy(source.relatedTo);
    return {
      scope: reach,
      entries: replaced(entries, index, [head]),
      stored: [head],
      removed: [],
    };
  }
  return {
    scope: "all",
    entries: replaced(entries, index, []),
    stored: [],
    removed: [source],
  };
};
