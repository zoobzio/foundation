import type { DataTableColumn, RowAction, BulkAction } from "#foundation/types/data/table";

export type FakeRow = {
  id: number;
  name: string;
  status: string;
  created: string;
  amount: number;
};

export const fakeColumns: DataTableColumn<FakeRow>[] = [
  { key: "id", label: "ID", type: "number" },
  { key: "name", label: "Name", type: "text", sortable: true },
  { key: "status", label: "Status", type: "enum", enumValues: ["Active", "Inactive", "Pending"] },
  { key: "created", label: "Created", type: "date", sortable: true },
  { key: "amount", label: "Amount", type: "currency" },
];

export const fakeRows: FakeRow[] = [
  { id: 1, name: "Alice", status: "Active", created: "2025-01-15", amount: 100 },
  { id: 2, name: "Bob", status: "Inactive", created: "2025-02-20", amount: 200 },
  { id: 3, name: "Charlie", status: "Pending", created: "2025-03-10", amount: 300 },
];

export const fakeActions: RowAction<FakeRow>[] = [
  { icon: "edit", label: "Edit", action: () => {} },
  { icon: "delete", label: "Delete", action: () => {} },
];

export const fakeBulkActions: BulkAction<number>[] = [
  { icon: "delete", label: "Delete Selected", action: () => {} },
];
