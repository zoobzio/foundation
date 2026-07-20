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
  price: z.number().nonnegative(),
  dueDate: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const commissionCreateSchema = commissionSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    description: z.string().default(""),
    status: z.enum(COMMISSION_STATUSES).default("draft"),
    price: z.number().nonnegative().default(0),
    dueDate: z.string().nullable().default(null),
  });

export const commissionUpdateSchema = commissionCreateSchema.partial();

export const commissionFiltersSchema = z.object({
  status: z.enum(COMMISSION_STATUSES).optional(),
  q: z.string().optional(),
});

export type CommissionStatus = (typeof COMMISSION_STATUSES)[number];
export type CommissionMaterial = (typeof COMMISSION_MATERIALS)[number];
export type Commission = z.infer<typeof commissionSchema>;
export type CommissionCreate = z.infer<typeof commissionCreateSchema>;
export type CommissionUpdate = z.infer<typeof commissionUpdateSchema>;
export type CommissionFilters = z.infer<typeof commissionFiltersSchema>;
