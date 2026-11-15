import { z } from "zod";

const entry = z.discriminatedUnion("kind", [
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
 * The schema of a table's saved view: what the table's `snapshot` yields
 * and its `restore` takes. Hand it to `createViews` for views over a
 * table. Every member has a default, so a view stored before a member
 * existed still reads; an app with more to save in a view extends it.
 */
export const TABLE_VIEW_SCHEMA = z.object({
  sorting: z.array(z.object({ id: z.string(), desc: z.boolean() })).default([]),
  columnOrder: z.array(z.string()).default([]),
  columnVisibility: z.record(z.string(), z.boolean()).default({}),
  columnSizing: z.record(z.string(), z.number()).default({}),
  pageSize: z.number().int().positive().default(10),
  entries: z.array(entry).default([]),
});

/**
 * The schema of a browser's saved view: what the browser's `snapshot`
 * yields and its `restore` takes.
 */
export const BROWSER_VIEW_SCHEMA = z.object({
  sortField: z.string().nullable().default(null),
  sortDirection: z.enum(["asc", "desc"]).default("asc"),
  entries: z.array(entry).default([]),
});
