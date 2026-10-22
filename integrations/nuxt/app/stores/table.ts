import type { TableInitial } from "../types/table";
import type { Config, State } from "@zoobzio/table";

import { useState } from "#imports";
import { createTableState } from "@zoobzio/table";
import { seed } from "../utils/state";

/**
 * The Nuxt backing for a table's state container: one `useState` record
 * keyed `table-<id>`. Its value is a reactive proxy, so the service's field
 * writes are tracked; instances sharing an id share the container across
 * the app, and it survives SSR hydration. `config` and `initial` shape the
 * record once, when it is first created; later calls under the same id get
 * the record as it stands.
 */
export const accessTable = <T>(
  id: string,
  config: Config<T>,
  initial?: TableInitial<T>,
): State<T> =>
  useState<State<T>>(`table-${id}`, () =>
    seed(createTableState(config), initial),
  ).value;
