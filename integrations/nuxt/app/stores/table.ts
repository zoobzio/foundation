import type { Config, RowData, State } from "@zoobzio/table";

import { useState } from "#app";
import { createTableState } from "@zoobzio/table";

/**
 * The Nuxt backing for a table's state container: one `useState` record
 * keyed `table-<id>`. Its value is a reactive proxy, so the service's field
 * writes are tracked; instances sharing an id share the container across
 * the app, and it survives SSR hydration. `config` shapes the record once,
 * when it is first created, its `initialState` and `initialClauses`
 * included; later calls under the same id get the record as it stands.
 */
export const accessTable = <T extends RowData>(
  id: string,
  config: Config<T>,
): State<T> =>
  useState<State<T>>(`table-${id}`, () => createTableState(config)).value;
