import type { Actions, Config, State } from "@zoobzio/table";

import { reactive } from "vue";
import { vi } from "vitest";
import { TableService, createTableState } from "@zoobzio/table";

/**
 * A row with a url column, so the body renders a link part.
 */
export type LinkedRow = {
  id: number;
  name: string;
  site: string;
};

export const linkedRows: LinkedRow[] = [
  { id: 1, name: "Alice", site: "https://a.example" },
  { id: 2, name: "Bob", site: "https://b.example" },
];

/**
 * A real table service over a reactive container, with a `vi.fn()` fetch
 * that resolves the linked rows. The shape every consumer builds.
 */
export const makeTable = (
  config: Partial<Config<LinkedRow>> = {},
  wiring: Partial<Actions<LinkedRow>> = {},
) => {
  const full: Config<LinkedRow> = {
    columns: [
      { accessorKey: "id", meta: { label: "ID", type: "number" } },
      { accessorKey: "name", meta: { label: "Name", type: "text" } },
      { accessorKey: "site", meta: { label: "Site", type: "url" } },
    ],
    getRowId: (row) => String(row.id),
    ...config,
  };
  const state: State<LinkedRow> = reactive(createTableState(full));
  const fetch =
    wiring.fetch ??
    vi.fn(async () => ({ data: linkedRows, rowCount: linkedRows.length }));
  const service = new TableService<LinkedRow>("test-table", full, state, {
    ...wiring,
    fetch,
  });
  return { service, state, fetch };
};
