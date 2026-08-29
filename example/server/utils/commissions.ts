import { z } from "zod";
import type {
  Commission,
  CommissionCreate,
  CommissionFilter,
  CommissionListQuery,
  CommissionListResult,
  CommissionUpdate,
} from "#shared/commissions";
import {
  COMMISSION_MATERIALS,
  COMMISSION_STATUSES,
} from "#shared/commissions";
import { useDb } from "~~/server/utils/db";

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
    rush: z.number(),
    price: z.number(),
    due_date: z.string().nullable(),
    link: z.string(),
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
      rush: row.rush !== 0,
      price: row.price,
      dueDate: row.due_date,
      link: row.link,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }),
  );

const NUMERIC_OP: Record<string, string> = {
  over: ">",
  under: "<",
  is: "=",
};

const DATE_OP: Record<string, string> = {
  before: "<",
  after: ">",
  on: "=",
};

const applyFilter = (
  conditions: string[],
  params: (string | number)[],
  filter: CommissionFilter,
): void => {
  switch (filter.key) {
    case "title":
    case "client":
      conditions.push(`${filter.key} LIKE ?`);
      params.push(`%${filter.value}%`);
      return;
    case "status":
    case "material":
      conditions.push(`${filter.key} = ?`);
      params.push(filter.value);
      return;
    case "rush":
      conditions.push("rush = ?");
      params.push(filter.value === "true" ? 1 : 0);
      return;
    case "price": {
      const op = NUMERIC_OP[filter.op ?? "is"] ?? "=";
      conditions.push(`price ${op} ?`);
      params.push(Number(filter.value) || 0);
      return;
    }
    case "dueDate":
    case "createdAt": {
      const column = filter.key === "dueDate" ? "due_date" : "created_at";
      const op = DATE_OP[filter.op ?? "on"] ?? "=";
      conditions.push(`DATE(${column}) ${op} DATE(?)`);
      params.push(filter.value);
      return;
    }
  }
};

const countSchema = z.object({ count: z.number() });

export const listCommissions = (
  query: CommissionListQuery,
): CommissionListResult => {
  const db = useDb();

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  for (const filter of query.filters) {
    applyFilter(conditions, params, filter);
  }
  if (query.q) {
    conditions.push("(title LIKE ? OR client LIKE ? OR description LIKE ?)");
    const like = `%${query.q}%`;
    params.push(like, like, like);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countRow = db
    .prepare(`SELECT COUNT(*) AS count FROM commissions ${where}`)
    .get(...params);
  const total = countSchema.parse(countRow).count;
  const pageCount = Math.ceil(total / query.pageSize);

  // sortField and sortDirection are enum-whitelisted by the query schema, so
  // interpolating them is safe.
  const order = query.sortField
    ? `ORDER BY ${query.sortField} ${query.sortDirection === "desc" ? "DESC" : "ASC"}, id DESC`
    : "ORDER BY created_at DESC, id DESC";

  const rows = db
    .prepare(`SELECT * FROM commissions ${where} ${order} LIMIT ? OFFSET ?`)
    .all(...params, query.pageSize, (query.page - 1) * query.pageSize);

  return {
    data: rows.map((row) => rowSchema.parse(row)),
    total,
    pageCount,
  };
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
      `INSERT INTO commissions (title, client, description, status, material, rush, price, due_date, link, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.title,
      input.client,
      input.description,
      input.status,
      input.material,
      input.rush ? 1 : 0,
      input.price,
      input.dueDate,
      input.link,
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
  "rush",
  "price",
  "dueDate",
  "link",
] as const;

const COLUMN_BY_FIELD: Record<(typeof UPDATABLE_FIELDS)[number], string> = {
  title: "title",
  client: "client",
  description: "description",
  status: "status",
  material: "material",
  rush: "rush",
  price: "price",
  dueDate: "due_date",
  link: "link",
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
      params.push(typeof value === "boolean" ? (value ? 1 : 0) : value);
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
