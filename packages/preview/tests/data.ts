import type { Config } from "../src/types";

export type FakeRow = {
  id: number;
  name: string;
  status: string;
  body: string;
};

export const fakeRows: FakeRow[] = [
  { id: 1, name: "Alice", status: "Active", body: "console.log('a')" },
  { id: 2, name: "Bob", status: "Inactive", body: "console.log('b')" },
];

export const fakeConfig: Config<FakeRow> = {
  fields: [
    { key: "name", label: "Name" },
    { key: "status", label: "Status" },
  ],
  content: { type: "code", key: "body", language: "javascript" },
};
