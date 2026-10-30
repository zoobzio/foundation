import type { ActionDescriptor, DataTableColumn } from "@zoobzio/table";

export type FakeRow = {
  id: number;
  name: string;
  status: string;
  created: string;
  amount: number;
  site: string;
};

export const fakeColumns: DataTableColumn<FakeRow>[] = [
  { key: "id", label: "ID", type: "number" },
  { key: "name", label: "Name", type: "text", sortable: true },
  {
    key: "status",
    label: "Status",
    type: "enum",
    values: ["Active", "Inactive", "Pending"],
  },
  { key: "created", label: "Created", type: "date", sortable: true },
  { key: "amount", label: "Amount", type: "currency" },
  { key: "site", label: "Site", type: "url" },
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
