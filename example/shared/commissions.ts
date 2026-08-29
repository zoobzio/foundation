import { z } from "zod";

export const COMMISSION_STATUSES = [
  "draft",
  "quoted",
  "in_progress",
  "complete",
  "cancelled",
] as const;

export const COMMISSION_MATERIALS = [
  "steel",
  "iron",
  "bronze",
  "brass",
  "copper",
  "silver",
] as const;

export const commissionSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  client: z.string().min(1),
  description: z.string(),
  status: z.enum(COMMISSION_STATUSES),
  material: z.enum(COMMISSION_MATERIALS),
  rush: z.boolean(),
  price: z.number().nonnegative(),
  dueDate: z.string().nullable(),
  link: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const commissionCreateSchema = commissionSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    description: z.string().default(""),
    status: z.enum(COMMISSION_STATUSES).default("draft"),
    rush: z.boolean().default(false),
    price: z.number().nonnegative().default(0),
    dueDate: z.string().nullable().default(null),
    link: z.string().default(""),
  });

export const commissionUpdateSchema = commissionCreateSchema.partial();

/**
 * Sortable columns, in the database's own vocabulary — the table config's
 * `sortKey`s point at these, so the whitelist doubles as SQL safety.
 */
export const COMMISSION_SORT_FIELDS = [
  "title",
  "client",
  "status",
  "material",
  "rush",
  "price",
  "due_date",
  "created_at",
] as const;

/**
 * One committed table filter, as sent by the table widget. Keys and
 * operators are enum-whitelisted; how each pair translates to SQL is the
 * server's business.
 */
export const commissionFilterSchema = z.object({
  key: z.enum([
    "title",
    "client",
    "status",
    "material",
    "rush",
    "price",
    "dueDate",
    "createdAt",
  ]),
  op: z.enum(["before", "after", "on", "over", "under", "is"]).optional(),
  value: z.string(),
});

export const commissionFiltersSchema = z.array(commissionFilterSchema);

/**
 * Query contract for the list endpoint: paging, sort, free-text `q`, and the
 * committed filters as one JSON-encoded param.
 */
export const commissionListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(25),
  sortField: z.enum(COMMISSION_SORT_FIELDS).optional(),
  sortDirection: z.enum(["asc", "desc"]).default("asc"),
  q: z.string().optional(),
  filters: z
    .string()
    .optional()
    .transform((s, ctx) => {
      if (!s) return [];
      try {
        return commissionFiltersSchema.parse(JSON.parse(s));
      } catch {
        ctx.addIssue({ code: "custom", message: "invalid filters" });
        return z.NEVER;
      }
    }),
});

export type CommissionStatus = (typeof COMMISSION_STATUSES)[number];
export type CommissionMaterial = (typeof COMMISSION_MATERIALS)[number];
export type Commission = z.infer<typeof commissionSchema>;
export type CommissionCreate = z.infer<typeof commissionCreateSchema>;
export type CommissionUpdate = z.infer<typeof commissionUpdateSchema>;
export type CommissionFilter = z.infer<typeof commissionFilterSchema>;
export type CommissionListQuery = z.infer<typeof commissionListQuerySchema>;

export type CommissionListResult = {
  data: Commission[];
  total: number;
  pageCount: number;
};
