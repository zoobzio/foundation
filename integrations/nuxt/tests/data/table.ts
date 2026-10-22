import type { DataTableColumn } from "@zoobzio/table";

export type FakeRow = {
  id: number;
  name: string;
  status: string;
  amount: number;
};

export const fakeColumns: DataTableColumn<FakeRow>[] = [
  { key: "id", label: "ID", type: "number" },
  { key: "name", label: "Name", type: "text", sortable: true },
  {
    key: "status",
    label: "Status",
    type: "enum",
    enumValues: ["Active", "Inactive"],
  },
  { key: "amount", label: "Amount", type: "currency" },
];

export const fakeRows: FakeRow[] = [
  { id: 1, name: "Alice", status: "Active", amount: 100 },
  { id: 2, name: "Bob", status: "Inactive", amount: 200 },
  { id: 3, name: "Charlie", status: "Active", amount: 300 },
];
