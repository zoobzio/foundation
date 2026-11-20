import { z } from "zod";

/**
 * The interval of the sync, in milliseconds: off, zero, where a view was
 * stored before it carried one.
 */
const interval = z.number().int().nonnegative().default(0);

const clause = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("literal"),
    key: z.string(),
    value: z.string(),
  }),
  z.object({
    kind: z.literal("filter"),
    key: z.string(),
    op: z.string().optional(),
    value: z.string(),
  }),
]);

/**
 * A stored payload as the schemas read it: one saved while the query's
 * clauses were its `entries` carries them under `clauses`, so a view
 * stored before the rename keeps its search rather than reading as none.
 */
const renamed = (payload: unknown): unknown => {
  if (typeof payload !== "object" || payload === null) return payload;
  if (!("entries" in payload) || "clauses" in payload) return payload;
  const { entries, ...rest } = payload;
  return { ...rest, clauses: entries };
};

/**
 * The schema of a table's saved view: what the table's `snapshot` yields
 * and its `restore` takes. Hand it to `createViews` for views over a
 * table. Every member has a default, so a view stored before a member
 * existed still reads; an app with more to save in a view extends the
 * object the schema reads into, its `out`.
 */
export const TABLE_VIEW_SCHEMA = z.preprocess(
  renamed,
  z.object({
    sorting: z
      .array(z.object({ id: z.string(), desc: z.boolean() }))
      .default([]),
    columnOrder: z.array(z.string()).default([]),
    columnPinning: z
      .object({
        start: z.array(z.string()).default([]),
        end: z.array(z.string()).default([]),
      })
      .default({ start: [], end: [] }),
    columnVisibility: z.record(z.string(), z.boolean()).default({}),
    columnSizing: z.record(z.string(), z.number()).default({}),
    pageSize: z.number().int().positive().default(10),
    clauses: z.array(clause).default([]),
    interval,
  }),
);

/**
 * The schema of a calendar's saved view: what the calendar's `snapshot`
 * yields and its `restore` takes. The view alone, the search, and the
 * sync's interval: a saved
 * view opens on the day the calendar stands on.
 */
export const CALENDAR_VIEW_SCHEMA = z.object({
  view: z.enum(["month", "week", "day", "agenda"]).default("month"),
  clauses: z.array(clause).default([]),
  interval,
});

/**
 * The schema of a timeline's saved view: what the timeline's `snapshot`
 * yields and its `restore` takes. The search and the sync's interval: a
 * saved view opens on the latest records, however far down it was read.
 */
export const TIMELINE_VIEW_SCHEMA = z.object({
  clauses: z.array(clause).default([]),
  interval,
});

/**
 * The schema of a browser's saved view: what the browser's `snapshot`
 * yields and its `restore` takes.
 */
export const BROWSER_VIEW_SCHEMA = z.preprocess(
  renamed,
  z.object({
    sortField: z.string().nullable().default(null),
    sortDirection: z.enum(["asc", "desc"]).default("asc"),
    clauses: z.array(clause).default([]),
    interval,
  }),
);
