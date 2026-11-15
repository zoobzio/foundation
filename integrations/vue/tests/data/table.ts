import type { ActionDescriptor, TableColumnDef } from "@zoobzio/table";

export type FakeRow = {
  id: number;
  name: string;
  status: string;
  created: string;
  amount: number;
  site: string;
};

export const fakeColumns: TableColumnDef<FakeRow>[] = [
  { accessorKey: "id", meta: { label: "ID", type: "number" } },
  { accessorKey: "name", meta: { label: "Name", type: "text" } },
  {
    accessorKey: "status",
    enableSorting: false,
    meta: {
      label: "Status",
      type: "enum",
      values: ["Active", "Inactive", "Pending"],
    },
  },
  { accessorKey: "created", meta: { label: "Created", type: "date" } },
  { accessorKey: "amount", meta: { label: "Amount", type: "currency" } },
  { accessorKey: "site", meta: { label: "Site", type: "url" } },
];

export const fakeRows: FakeRow[] = [
  {
    id: 1,
    name: "Alice",
    status: "Active",
    created: "2025-01-15",
    amount: 100,
    site: "https://a.example",
  },
  {
    id: 2,
    name: "Bob",
    status: "Inactive",
    created: "2025-02-20",
    amount: 200,
    site: "https://b.example",
  },
  {
    id: 3,
    name: "Charlie",
    status: "Pending",
    created: "2025-03-10",
    amount: 300,
    site: "https://c.example",
  },
];

export const fakeActions: Record<string, ActionDescriptor> = {
  edit: { label: "Edit" },
  remove: { label: "Delete" },
};

export const fakeBulkActions: Record<string, ActionDescriptor> = {
  removeSelected: { label: "Delete Selected" },
};
