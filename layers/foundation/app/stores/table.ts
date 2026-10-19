import type { Config, State } from "../types/data/table";

import { useState } from "#imports";
import { createTableState } from "@zoobzio/table";

/**
 * The Nuxt backing for a table's state container: one `useState` record
 * keyed `table-<id>`. Its value is a reactive proxy, so the service's field
 * writes are tracked; instances sharing an id share the container across
 * the app and it survives SSR hydration.
 */
export const accessTable = <T>(id: string, config: Config<T>): State<T> =>
  useState<State<T>>(`table-${id}`, () => createTableState(config)).value;
