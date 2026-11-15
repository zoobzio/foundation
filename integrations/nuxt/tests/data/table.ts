import type { TableColumnDef } from "@zoobzio/table";

export type FakeRow = {
  id: number;
  name: string;
  status: string;
  amount: number;
};

export const fakeColumns: TableColumnDef<FakeRow>[] = [
  { accessorKey: "id", meta: { label: "ID", type: "number" } },
  { accessorKey: "name", meta: { label: "Name", type: "text" } },
  {
    accessorKey: "status",
    meta: { label: "Status", type: "enum", values: ["Active", "Inactive"] },
  },
  { accessorKey: "amount", meta: { label: "Amount", type: "currency" } },
];

export const getRowId = (row: FakeRow): string => String(row.id);

export const fakeRows: FakeRow[] = [
  { id: 1, name: "Alice", status: "Active", amount: 100 },
  { id: 2, name: "Bob", status: "Inactive", amount: 200 },
  { id: 3, name: "Charlie", status: "Active", amount: 300 },
];
