import { z } from "zod";
import type {
  Commission,
  CommissionCreate,
  CommissionFilters,
  CommissionUpdate,
} from "#shared/commissions";
import {
  COMMISSION_MATERIALS,
  COMMISSION_STATUSES,
} from "#shared/commissions";
import { useDb } from "./db";

// Rows come out of node:sqlite as untyped records; parse them into the
// shared Commission shape instead of casting.
const rowSchema = z
  .object({
    id: z.number().int().positive(),
    title: z.string(),
    client: z.string(),
    description: z.string(),
    status: z.enum(COMMISSION_STATUSES),
    material: z.enum(COMMISSION_MATERIALS),
    price: z.number(),
    due_date: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
  })
  .transform(
    (row): Commission => ({
      id: row.id,
      title: row.title,
      client: row.client,
      description: row.description,
      status: row.status,
      material: row.material,
      price: row.price,
      dueDate: row.due_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }),
  );

export const listCommissions = (filters: CommissionFilters): Commission[] => {
  const db = useDb();

  const conditions: string[] = [];
  const params: string[] = [];

  if (filters.status) {
    conditions.push("status = ?");
    params.push(filters.status);
  }
  if (filters.q) {
    conditions.push("(title LIKE ? OR client LIKE ? OR description LIKE ?)");
    const like = `%${filters.q}%`;
    params.push(like, like, like);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = db
    .prepare(`SELECT * FROM commissions ${where} ORDER BY created_at DESC, id DESC`)
    .all(...params);

  return rows.map((row) => rowSchema.parse(row));
};

export const getCommission = (id: number): Commission | null => {
  const db = useDb();
  const row = db.prepare("SELECT * FROM commissions WHERE id = ?").get(id);
  if (!row) {
    return null;
  }
  return rowSchema.parse(row);
};

export const createCommission = (input: CommissionCreate): Commission => {
  const db = useDb();
  const now = new Date().toISOString();

  const result = db
    .prepare(
      `INSERT INTO commissions (title, client, description, status, material, price, due_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.title,
      input.client,
      input.description,
      input.status,
      input.material,
      input.price,
      input.dueDate,
      now,
      now,
    );

  const row = db
    .prepare("SELECT * FROM commissions WHERE id = ?")
    .get(result.lastInsertRowid);
  return rowSchema.parse(row);
};

const UPDATABLE_FIELDS = [
  "title",
  "client",
  "description",
  "status",
  "material",
  "price",
  "dueDate",
] as const;

const COLUMN_BY_FIELD: Record<(typeof UPDATABLE_FIELDS)[number], string> = {
  title: "title",
  client: "client",
  description: "description",
  status: "status",
  material: "material",
  price: "price",
  dueDate: "due_date",
};

export const updateCommission = (
  id: number,
  patch: CommissionUpdate,
): Commission | null => {
  const existing = getCommission(id);
  if (!existing) {
    return null;
  }

  const assignments: string[] = [];
  const params: Array<string | number | null> = [];

  for (const field of UPDATABLE_FIELDS) {
    const value = patch[field];
    if (value !== undefined) {
      assignments.push(`${COLUMN_BY_FIELD[field]} = ?`);
      params.push(value);
    }
  }

  if (assignments.length === 0) {
    return existing;
  }

  assignments.push("updated_at = ?");
  params.push(new Date().toISOString());

  const db = useDb();
  db.prepare(`UPDATE commissions SET ${assignments.join(", ")} WHERE id = ?`).run(
    ...params,
    id,
  );

  return getCommission(id);
};

export const deleteCommission = (id: number): boolean => {
  const db = useDb();
  const result = db.prepare("DELETE FROM commissions WHERE id = ?").run(id);
  return result.changes > 0;
};
