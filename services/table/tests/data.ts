import type { ActionDescriptor, TableColumnDef } from "../src/types";

export type FakeRow = {
  id: number;
  name: string;
  status: string;
  created: string;
  amount: number;
};

const NUMBER_OPERATORS = ["over", "under", "is"];
const DATE_OPERATORS = ["before", "after", "on"];

export const fakeColumns: TableColumnDef<FakeRow>[] = [
  {
    accessorKey: "id",
    enableHiding: false,
    size: 80,
    meta: {
      label: "ID",
      type: "number",
      operators: NUMBER_OPERATORS,
      defaultOperator: "is",
    },
  },
  { accessorKey: "name", minSize: 120, meta: { label: "Name", type: "text" } },
  {
    accessorKey: "status",
    enableSorting: false,
    meta: {
      label: "Status",
      type: "enum",
      values: ["Active", "Inactive", "Pending"],
    },
  },
  {
    accessorKey: "created",
    meta: {
      label: "Created",
      type: "date",
      operators: DATE_OPERATORS,
      defaultOperator: "on",
    },
  },
  {
    accessorKey: "amount",
    meta: {
      label: "Amount",
      type: "currency",
      operators: NUMBER_OPERATORS,
      defaultOperator: "is",
    },
  },
];

export const fakeRows: FakeRow[] = [
  {
    id: 1,
    name: "Alice",
    status: "Active",
    created: "2025-01-15",
    amount: 100,
  },
  {
    id: 2,
    name: "Bob",
    status: "Inactive",
    created: "2025-02-20",
    amount: 200,
  },
  {
    id: 3,
    name: "Charlie",
    status: "Pending",
    created: "2025-03-10",
    amount: 300,
  },
];

export const getRowId = (row: FakeRow): string => String(row.id);

export const fakeActions: Record<string, ActionDescriptor> = {
  edit: { label: "Edit" },
  delete: { label: "Delete" },
};

export const fakeBulkActions: Record<string, ActionDescriptor> = {
  deleteSelected: { label: "Delete Selected" },
};
