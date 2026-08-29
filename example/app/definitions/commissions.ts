import type { Commission } from "#shared/commissions";

import { defineEntity } from "@zoobzio/foundation/definitions/entity";

import {
  COMMISSION_MATERIALS,
  COMMISSION_STATUSES,
} from "#shared/commissions";

const commission = defineEntity<Commission>();

/**
 * The commissions table as data — deliberately the kitchen sink, so every
 * column type and search stage is exercised: text (contains), enum
 * (values), boolean (true/false), currency + date + datetime (operator
 * stage), url (unfilterable render), pinned + hidden-by-default columns,
 * and row/bulk action descriptors.
 */
export const COMMISSIONS_TABLE = commission.defineTable({
  rowKey: "id",
  pinnedColumns: ["title"],
  defaultColumnOrder: [
    "title",
    "client",
    "status",
    "material",
    "rush",
    "price",
    "dueDate",
  ],
  columns: [
    { key: "title", label: "Title", type: "text", sortable: true },
    { key: "client", label: "Client", type: "text", sortable: true },
    {
      key: "status",
      label: "Status",
      type: "enum",
      enumValues: [...COMMISSION_STATUSES],
      sortable: true,
    },
    {
      key: "material",
      label: "Material",
      type: "enum",
      enumValues: [...COMMISSION_MATERIALS],
      sortable: true,
    },
    { key: "rush", label: "Rush", type: "boolean", sortable: true },
    {
      key: "price",
      label: "Price",
      type: "currency",
      align: "right",
      sortable: true,
    },
    {
      key: "dueDate",
      label: "Due",
      type: "date",
      sortable: true,
      sortKey: "due_date",
    },
    {
      key: "createdAt",
      label: "Created",
      type: "datetime",
      sortable: true,
      sortKey: "created_at",
    },
    { key: "link", label: "Link", type: "url", filterable: false },
  ],
  actions: {
    edit: { icon: "edit", label: "Edit" },
    remove: { icon: "delete", label: "Delete" },
  },
  bulkActions: {
    removeSelected: { icon: "delete", label: "Delete selected" },
  },
});
