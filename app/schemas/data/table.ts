import { z } from "zod";
import { TABLE_DEFAULT_MATCH_MODE, TABLE_DEFAULT_PAGE_SIZE, TABLE_DEFAULT_SORT_DIRECTION } from "#foundation/constants/data/table";

export const DateFilterSchema = z.object({
  field: z.string(),
  operator: z.enum(["before", "after", "between"]),
  value: z.coerce.date(),
  endValue: z.coerce.date().optional(),
});

export const DataTableSnapshotSchema = z.object({
  query: z.string().default(""),
  keywords: z.string().default(""),
  match: z.enum(["all", "any"]).default(TABLE_DEFAULT_MATCH_MODE),
  page: z.number().default(1),
  pageSize: z.number().default(TABLE_DEFAULT_PAGE_SIZE),
  selectedFacets: z.array(z.string()).default([]),
  dateFilters: z.array(DateFilterSchema).default([]),
  sortField: z.string().nullable().default(null),
  sortDirection: z.enum(["asc", "desc"]).default(TABLE_DEFAULT_SORT_DIRECTION),
  columnOrder: z.array(z.string()).default([]),
});

export type DataTableSnapshot = z.infer<typeof DataTableSnapshotSchema>;
