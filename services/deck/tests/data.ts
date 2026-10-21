import type { Config, FacetGroup } from "../src/types";

export type FakeRow = {
  id: number;
  name: string;
  status: string;
  created: string;
  amount: number;
};

export const fakeRows: FakeRow[] = [
  {
    id: 3,
    name: "Charlie",
    status: "Pending",
    created: "2025-03-10",
    amount: 300,
  },
  {
    id: 2,
    name: "Bob",
    status: "Inactive",
    created: "2025-02-20",
    amount: 200,
  },
  {
    id: 1,
    name: "Alice",
    status: "Active",
    created: "2025-01-15",
    amount: 100,
  },
];

export const fakeConfig: Config<FakeRow> = {
  topic: "contacts",
  rowKey: "id",
  dateFields: [
    { key: "created", label: "Created" },
    { key: "amount", label: "Billed" },
  ],
};

export const fakeFacets: FacetGroup[] = [
  {
    key: "status",
    label: "Status",
    items: [
      { value: "Active", label: "Active", count: 1 },
      { value: "Pending", label: "Pending", count: 1 },
    ],
  },
];
