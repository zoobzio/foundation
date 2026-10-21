/**
 * A domain-neutral record fixture shared by the deck and chart suites —
 * the rows only; each feature's own fixtures carry its columns.
 */
export type FakeRow = {
  id: number;
  name: string;
  status: string;
  created: string;
  amount: number;
};

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
