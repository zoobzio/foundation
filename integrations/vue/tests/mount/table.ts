import type { Actions, Config, State } from "@zoobzio/table";
import type { FakeRow } from "#test/data/table";

import { reactive } from "vue";
import { vi } from "vitest";
import { TableService, createTableState } from "@zoobzio/table";
import { fakeColumns, fakeRows } from "#test/data/table";

/**
 * A real table service over a reactive container, with a `vi.fn()` fetch
 * that resolves the fake rows. The shape every consumer builds.
 */
export const makeTable = (
  config: Partial<Config<FakeRow>> = {},
  wiring: Partial<Actions<FakeRow>> = {},
  rows: FakeRow[] = fakeRows,
) => {
  const full: Config<FakeRow> = {
    columns: fakeColumns,
    rowKey: "id",
    ...config,
  };
  const state: State<FakeRow> = reactive(createTableState(full));
  const fetch =
    wiring.fetch ??
    vi.fn(async () => ({ data: rows, total: rows.length, pageCount: 4 }));
  const service = new TableService<FakeRow>("test-table", full, state, {
    ...wiring,
    fetch,
  });
  return { service, state, fetch };
};
