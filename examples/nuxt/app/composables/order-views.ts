// The saved views of the orders table: the arrangements the app ships and
// the ones a visitor saves beside them. They are held in the layer's store
// alone, so they last as long as the page does; a real app hands
// `createViews` a `load`, a `save`, and a `remove` that reach its backend.
import type { TableView } from "@zoobzio/nuxt/types/views";

import { TABLE_VIEW_SCHEMA } from "@zoobzio/nuxt/constants/views";
import { createViews } from "@zoobzio/nuxt/factories/views";

/** The table as it starts: newest first, every column, ten to a page. */
const all: TableView = {
  ...TABLE_VIEW_SCHEMA.parse({}),
  sorting: [{ id: "placed", desc: true }],
};

export const useOrderViews = createViews("orders", {
  schema: TABLE_VIEW_SCHEMA,
  views: [
    { id: "all", name: "All orders", payload: all },
    {
      id: "to-ship",
      name: "To ship",
      payload: {
        ...all,
        sorting: [{ id: "placed", desc: false }],
        columnVisibility: { gift: false },
        clauses: [{ kind: "filter", key: "status", value: "Paid" }],
      },
    },
    {
      id: "big-spenders",
      name: "Big spenders",
      payload: {
        ...all,
        sorting: [{ id: "total", desc: true }],
        columnOrder: ["id", "total", "customer"],
        pageSize: 25,
        clauses: [{ kind: "filter", key: "total", op: "over", value: "300" }],
      },
    },
  ],
});
