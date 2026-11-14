// The orders table of the example: a table over a fake backend, an array in
// memory that `fetch` reads. The backend does what a real one would: it
// narrows the orders by the search, sorts them, and hands back one page
// with the total, so the table holds a page and never the whole list.
import type {
  DataTableFetchParams,
  DataTableFetchResult,
  TableFilter,
} from "@zoobzio/table";

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

/** The fields the backend sorts by, by the sort field a column names. */
const SORTS: Record<string, keyof Order | undefined> = {
  id: "id",
  customer: "customer",
  status: "status",
  items: "items",
  total: "total",
  placed: "placed",
};

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The backend's read: the orders the search leaves, sorted, one page of
 * them. Free text matches the order's number or its customer.
 */
const fetch = async ({
  page,
  pageSize,
  sortField,
  sortDirection,
  query,
  filters,
}: DataTableFetchParams): Promise<DataTableFetchResult<Order>> => {
  await pause(150);
  const term = query.trim().toLowerCase();

  const found = orders.filter(
    (order) =>
      (!term ||
        order.id.includes(term) ||
        order.customer.toLowerCase().includes(term)) &&
      filters.every((filter) => passes(order, filter)),
  );

  const field = SORTS[sortField ?? ""];
  if (field) {
    const sign = sortDirection === "asc" ? 1 : -1;
    found.sort((a, b) => {
      const x = a[field];
      const y = b[field];
      const order =
        typeof x === "number" && typeof y === "number"
          ? x - y
          : String(x).localeCompare(String(y));
      return order * sign;
    });
  }

  const start = (page - 1) * pageSize;
  return {
    data: found.slice(start, start + pageSize),
    total: found.length,
    pageCount: Math.max(1, Math.ceil(found.length / pageSize)),
  };
};

export const useOrders = createTable<Order>("orders", {
  rowKey: "id",
  pinnedColumns: ["id"],
  columns: [
    { key: "id", label: "Order", type: "text", sortable: true, width: 96 },
    {
      key: "customer",
      label: "Customer",
      type: "text",
      sortable: true,
      width: 180,
    },
    {
      key: "status",
      label: "Status",
      type: "enum",
      sortable: true,
      values: [...STATUSES],
    },
    {
      key: "items",
      label: "Items",
      type: "number",
      sortable: true,
      width: 88,
      operators: ["over", "under"],
      defaultOperator: "over",
    },
    {
      key: "total",
      label: "Total",
      type: "currency",
      sortable: true,
      operators: ["over", "under"],
      defaultOperator: "over",
    },
    {
      key: "placed",
      label: "Placed",
      type: "date",
      sortable: true,
      operators: ["on", "before", "after"],
      defaultOperator: "on",
    },
    {
      key: "gift",
      label: "Gift",
      type: "boolean",
      values: ["Yes", "No"],
      width: 80,
    },
  ],
  initial: { pageSize: 10, sortField: "placed", sortDirection: "desc" },
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
        orders = orders.filter((o) => !selected.has(o.id));
        const table = useOrders();
        table.clearSelection();
        table.fetch();
      },
    },
  },
});
