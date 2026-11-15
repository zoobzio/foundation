// The orders table of the example: a table over a fake backend, an array in
// memory that `fetch` reads. The backend does what a real one would: it
// narrows the orders by the search, sorts them, and hands back one page
// with the total, so the table holds a page and never the whole list.
import type { FetchParams, FetchResult, TableFilter } from "@zoobzio/table";

import { createTable } from "@zoobzio/nuxt/factories/table";

export type Order = {
  id: string;
  customer: string;
  status: "Pending" | "Paid" | "Shipped" | "Refunded";
  items: number;
  total: number;
  placed: string;
  gift: boolean;
};

const DAY = 86_400_000;

/** A day a number of days back from today, as an ISO date. */
const ago = (days: number): string =>
  new Date(Date.now() - days * DAY).toISOString().slice(0, 10);

/**
 * A seeded generator, so the server and the browser build the same orders
 * and the page hydrates over the rows it was rendered with.
 */
const seeded = (seed: number) => (): number => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
};

const random = seeded(7);

const pick = <V>(from: readonly [V, ...V[]]): V =>
  from[Math.floor(random() * from.length)] ?? from[0];

const FIRST = [
  "Ada",
  "Grace",
  "Linus",
  "Margaret",
  "Alan",
  "Barbara",
  "Ken",
] as const;
const LAST = [
  "Lovelace",
  "Hopper",
  "Torvalds",
  "Hamilton",
  "Turing",
  "Liskov",
] as const;
const STATUSES = ["Pending", "Paid", "Shipped", "Refunded"] as const;

let orders: Order[] = Array.from({ length: 137 }, (_, i) => {
  const items = 1 + Math.floor(random() * 8);
  return {
    id: `#${1000 + i}`,
    customer: `${pick(FIRST)} ${pick(LAST)}`,
    // The newest orders are the ones still pending.
    status: i > 133 ? "Pending" : pick(STATUSES),
    items,
    total: Math.round(items * (8 + random() * 90) * 100) / 100,
    placed: ago(137 - i),
    gift: random() < 0.2,
  };
});

/** Whether an order passes one committed column filter. */
const passes = (order: Order, { key, op, value }: TableFilter): boolean => {
  switch (key) {
    case "id":
      return order.id.includes(value);
    case "customer":
      return order.customer.toLowerCase().includes(value.toLowerCase());
    case "status":
      return order.status === value;
    case "gift":
      return order.gift === (value === "Yes");
    case "items":
    case "total":
      return op === "under"
        ? order[key] < Number(value)
        : order[key] > Number(value);
    case "placed":
      if (op === "before") return order.placed < value;
      if (op === "after") return order.placed > value;
      return order.placed === value;
    default:
      return true;
  }
};

/** How two orders stand under one field: numbers by size, the rest as text. */
const compare = (a: Order, b: Order, field: keyof Order): number => {
  const x = a[field];
  const y = b[field];
  return typeof x === "number" && typeof y === "number"
    ? x - y
    : String(x).localeCompare(String(y));
};

/** Whether a sort names a field of an order, as a column's id does. */
const sortable = (id: string, order: Order): id is keyof Order & string =>
  id in order;

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The backend's read: the orders the search leaves, sorted, one page of
 * them. Free text matches the order's number or its customer.
 */
const fetch = async ({
  pagination: { pageIndex, pageSize },
  sorting,
  query,
  filters,
}: FetchParams): Promise<FetchResult<Order>> => {
  await pause(150);
  const term = query.trim().toLowerCase();

  const found = orders.filter(
    (order) =>
      (!term ||
        order.id.includes(term) ||
        order.customer.toLowerCase().includes(term)) &&
      filters.every((filter) => passes(order, filter)),
  );

  // The sorts in order, as an `ORDER BY` lists them: the first decides,
  // and each one after breaks the ties the ones before leave.
  found.sort((a, b) => {
    for (const { id, desc } of sorting) {
      if (!sortable(id, a)) continue;
      const order = compare(a, b, id);
      if (order !== 0) return desc ? -order : order;
    }
    return 0;
  });

  const start = pageIndex * pageSize;
  return {
    data: found.slice(start, start + pageSize),
    rowCount: found.length,
  };
};

export const useOrders = createTable<Order>("orders", {
  getRowId: (order) => order.id,
  defaultColumn: { minSize: 48 },
  columns: [
    {
      accessorKey: "id",
      size: 96,
      enableHiding: false,
      meta: { label: "Order", type: "text" },
    },
    {
      accessorKey: "customer",
      size: 180,
      meta: { label: "Customer", type: "text" },
    },
    {
      accessorKey: "status",
      meta: { label: "Status", type: "enum", values: [...STATUSES] },
    },
    {
      accessorKey: "items",
      size: 88,
      meta: {
        label: "Items",
        type: "number",
        operators: ["over", "under"],
        defaultOperator: "over",
      },
    },
    {
      accessorKey: "total",
      meta: {
        label: "Total",
        type: "currency",
        operators: ["over", "under"],
        defaultOperator: "over",
      },
    },
    {
      accessorKey: "placed",
      meta: {
        label: "Placed",
        type: "date",
        operators: ["on", "before", "after"],
        defaultOperator: "on",
      },
    },
    {
      accessorKey: "gift",
      size: 80,
      meta: { label: "Gift", type: "boolean", values: ["Yes", "No"] },
    },
  ],
  initialState: { sorting: [{ id: "placed", desc: true }] },
  fetch,
  actions: {
    refund: {
      label: "Refund",
      icon: "undo",
      action: (order) => {
        orders = orders.map((o) =>
          o.id === order.id ? { ...o, status: "Refunded" } : o,
        );
        useOrders().fetch();
      },
    },
    remove: {
      label: "Delete",
      icon: "remove",
      action: (order) => {
        orders = orders.filter((o) => o.id !== order.id);
        useOrders().fetch();
      },
    },
  },
  bulkActions: {
    remove: {
      label: "Delete",
      icon: "remove",
      action: (selected) => {
        orders = orders.filter((o) => !selected.includes(o.id));
        const service = useOrders();
        service.table.resetRowSelection(true);
        service.fetch();
      },
    },
  },
});
